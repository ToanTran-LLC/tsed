import {Get, ParamMetadata, ParamTypes, QueryParams, UseFilter, UseParam} from "@tsed/common";
import {Description, Example, getSpec, Property, Required, Title} from "@tsed/schema";
import {expect} from "chai";
import {IFilter} from "../../interfaces/IFilter";

export class MyModel {
  @Title("iD")
  @Description("Description of calendar model id")
  @Example("Description example")
  @Property()
  public id: string;

  @Property()
  @Required()
  public name: string;
}

describe("@UseParam", () => {
  describe("when filter is a class", () => {
    it("should create useParam", () => {
      class Test {}

      class Ctrl {
        test(
          @UseParam(ParamTypes.BODY, {
            expression: "expression",
            useConverter: true,
            useValidation: true,
            paramType: ParamTypes.BODY,
            useType: Test
          })
          body: Test
        ) {}
      }

      const param = ParamMetadata.get(Ctrl, "test", 0);
      expect(param.expression).to.eq("expression");
      expect(param.paramType).to.eq(ParamTypes.BODY);
      expect(param.type).to.eq(Test);
    });
    it("should create useFilter (withoutFilter)", () => {
      class Test {}

      class Ctrl {
        test(
          @UseFilter(ParamTypes.BODY, {
            expression: "expression",
            useConverter: true,
            useValidation: true,
            paramType: ParamTypes.BODY,
            useType: Test
          })
          body: Test
        ) {}
      }

      const param = ParamMetadata.get(Ctrl, "test", 0);
      expect(param.expression).to.eq("expression");
      expect(param.paramType).to.eq(ParamTypes.BODY);
      expect(param.type).to.eq(Test);
    });
    it("should create useFilter (withFilter", () => {
      class Test {}

      class MyFilter implements IFilter {
        transform(expression: string, request: TsED.Request, response: TsED.Response): any {
          return "";
        }
      }

      class Ctrl {
        test(
          @UseFilter(MyFilter, {
            expression: "expression",
            useConverter: true,
            useValidation: true,
            paramType: ParamTypes.BODY,
            useType: Test
          })
          body: Test
        ) {}
      }

      const param = ParamMetadata.get(Ctrl, "test", 0);
      expect(param.expression).to.eq("expression");
      expect(param.paramType).to.eq(ParamTypes.BODY);
      expect(param.type).to.eq(Test);
      expect(param.filter!).to.eq(MyFilter);
    });
  });
  describe("when is a Query param with boolean", () => {
    it("should return the right spec", () => {
      class Ctrl {
        @Get("/")
        get(@QueryParams("test") value: boolean) {}
      }

      const spec = getSpec(Ctrl);

      expect(spec).to.deep.equal({
        definitions: {},
        paths: {
          "/": {
            get: {
              operationId: "ctrlGet",
              parameters: [
                {
                  in: "query",
                  name: "test",
                  required: false,
                  type: "boolean"
                }
              ],
              responses: {
                "200": {
                  description: "Success"
                }
              },
              tags: ["Ctrl"]
            }
          }
        },
        tags: [
          {
            name: "Ctrl"
          }
        ]
      });
    });
  });
});
