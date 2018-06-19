import {
  IBackgroundFluid, IFluidFnCallback, IGherkinAstScenario, IGherkinAstScenarioOutline,
  IScenarioFluid, IScenarioOutlineFluid,
} from '.';
import { IGherkinAstBackground, IGherkinAstEntity, IGherkinAstExamples, IGherkinAstFeature, IGherkinAstStep, IGherkinAstTableRow } from './ast';

// tslint:disable-next-line

export type IMatch = string | RegExp;

export type IGherkinCollectionItemShape = IGherkinAstEntity | IGherkinAstStep;
export type IGherkinCollectionItemIndex = IGherkinAstEntity & IGherkinAstStep;

export type IGherkinParams = string | number | IGherkinAstTableRow;

export interface IGherkinTableParam {

  /**
   * @example
   *   table.rows()
   *   === ['a', 'b']
   */
  rows: {
    (): string[][];

    /**
     * @example
     *   table.rows.mapTop()
     *   === [['header', 'cellValue']]
     */
    mapByTop (): Array<Map<string, string>>;

    /**
     * @example
     *   table.rows.mapLeft()
     *   === [['firstColumnCellValue', 'cellValue']]
     */
    mapByLeft (): Array<Map<string, string>>;

  };

  /**
   * @example
   *   table.dict().get(someKey)
   *   === ['a', 'b', 'c']
   */
  dict: {
    (): Map<string, string[]>;

    /**
     * @example
     *   table.dict.byTop().get(someKey)
     *   === ['a', 'b', 'c']
     */
    byTop (): Map<string, string[]>;

    /**
     * @example
     *   table.dict.byLeft().get(someKeyFromFirstColumnCell)
     *   === ['a', 'b', 'c']
     */
    byLeft (): Map<string, string[]>;
  };

  /**
   * @example
   *   table.headers()
   *   === ['type', 'name', 'size']
   */
  headers (): string[];
}

export interface IGherkinFeatureMappings<Ge = any> {
  match: IMatch;
  gherkin: Ge;
}

export interface IScenarioBuilder<
  S extends IGherkinScenario | IGherkinScenarioOutline = IGherkinScenario
> {
  steps: IScenarioFluid;
  scenario: S;
}

export interface IBackgroundBuilder {
  steps: IBackgroundFluid;
  background: IGherkinBackground;
}

/**
 * Produces a subset ScenarioOutline that looks like this:
 * @example { Given, When, Then, Examples: { operations } }
 */
export interface IScenarioOutlineBuilder {
  steps: IScenarioOutlineFluid;
  scenarioOutline: IGherkinScenarioOutline;
}

export type IGherkinOperationStore<
  G extends IGherkinCollectionItemShape = IGherkinCollectionItemShape
> = Map<IMatch, {
  fn: IFluidFnCallback,
  name: string;
  gherkin: G;
  params: any[], // TODO: this needs to be array of string/int/data table
}>;

export interface IGherkinScenarioBase {
  match: IMatch;
  name: IGherkinAstScenario['name'];
  Given?: IGherkinOperationStore<IGherkinAstStep>;
  When?: IGherkinOperationStore<IGherkinAstStep>;
  Then?: IGherkinOperationStore<IGherkinAstStep>;
}

export interface IGherkinScenario extends IGherkinScenarioBase {
  gherkin: IGherkinAstScenario;
}

export interface IGherkinScenarioOutline extends IGherkinScenarioBase {
  gherkin: IGherkinAstScenarioOutline;
  Examples: IGherkinOperationStore<IGherkinAstExamples>;
}

export interface IGherkinBackground {
  match: IMatch;
  name: IGherkinAstBackground['name'];
  gherkin: IGherkinAstBackground;
  Given: IGherkinOperationStore<IGherkinAstStep>;
}

export interface IGherkinFeature {
  gherkin: IGherkinAstFeature;
  name: IGherkinAstFeature['name'];

  Background?: IGherkinBackground;
  Scenarios: Map<IMatch, IGherkinScenario>;
  ScenarioOutlines: Map<IMatch, IGherkinScenarioOutline>;
}
