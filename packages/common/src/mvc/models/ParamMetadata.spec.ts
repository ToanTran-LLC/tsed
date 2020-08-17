import {Controller, Req} from "@tsed/common";
import {prototypeOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Get} from "../decorators/method/route";
import {IFilter} from "../interfaces/IFilter";
import {ParamMetadata} from "./ParamMetadata";
import {ParamTypes} from "./ParamTypes";

class Test {
  method(arg1: any, arg2: any) {}
}

class TestFilter implements IFilter {
  transform(value: any) {
    return value;
  }
}

describe("ParamMetadata", () => {
  describe("props", () => {
    it("should return the required value", () => {
      const paramMetadata = ParamMetadata.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;

      expect(paramMetadata.required)
        .to.be.a("boolean")
        .and.to.eq(true);

      expect(paramMetadata.expression)
        .to.be.a("string")
        .and.to.eq("test");

      expect(paramMetadata.collectionType).to.eq(undefined);
      expect(paramMetadata.type).to.eq(Test);
      expect(paramMetadata.index).to.eq(0);
      expect(paramMetadata.store).to.be.an.instanceof(Store);
    });
  });

  describe("as a service", () => {
    it("should return the service", () => {
      const paramMetadata = ParamMetadata.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.paramType = ParamTypes.ERR;

      expect(paramMetadata.service)
        .to.be.a("string")
        .to.eq(ParamTypes.ERR);
    });
  });

  describe("as a filter", () => {
    it("should return the service", () => {
      const paramMetadata = ParamMetadata.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.filter = TestFilter;

      expect(paramMetadata.service).to.eq(TestFilter);
    });
  });

  describe("getParams", () => {
    it("should returns params (REQ)", () => {
      // GIVEN
      @Controller("/")
      class Test {
        @Get("/")
        test(@Req() req: any) {}
      }

      // WHEN
      const result = ParamMetadata.getParams(prototypeOf(Test), "test");

      // THEN
      expect(result[0].paramType).to.deep.eq(ParamTypes.REQUEST);
    });

    it("should returns params (RES)", () => {
      // GIVEN
      class Test {
        @Get("/")
        test(@Req() req: any) {}
      }

      // WHEN
      const result = ParamMetadata.getParams(prototypeOf(Test), "test");

      // THEN

      expect(result[0].paramType).to.deep.eq(ParamTypes.REQUEST);
    });
  });
});
