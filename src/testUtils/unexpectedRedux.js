import unexpected from "unexpected";

export const unexpectedRedux = {
  name: "unexpected-redux",
  version: "0.0.0",
  installInto: expect => {
    expect.addType({
      name: "ReduxStore",
      base: "object",
      identify: obj =>
        obj &&
        typeof obj.dispatch === "function" &&
        typeof obj.getState === "function" &&
        typeof obj.subscribe === "function",
      inspect: (obj, depth, output) => {
        output.text("ReduxStore", "jsFunctionName");
      }
    });

    expect.addAssertion(
      "<ReduxStore> to have state [exhaustively] satisfying <any>",
      (expect, store, value) => {
        return expect(store.getState(), "to [exhaustively] satisfy", value);
      }
    );

    expect.addAssertion(
      "<ReduxStore> to have state <any>",
      (expect, store, value) => {
        return expect(store.getState(), "to equal", value);
      }
    );

    /*
        import expect from '../../../../../testUtils/unexpectedRedux';
        import * as constants from '../constants';
        it('should have only valid constants', () => expect(constants, 'to have valid constants'));

        TODO: should be extended to allow { CONSTANT: '@prefix/CONSTANT' }
        */

    expect
      .addAssertion(
        "<object> to only have uppercase keys",
        (expect, subject) => {
          return expect(
            Object.keys(subject),
            "to have items satisfying",
            /^[A-Z][A-Z_]*$/
          );
        }
      )
      .addAssertion(
        "<object> to only have uppercase strings as values",
        (expect, subject) => {
          const values = Object.keys(subject).map(key => subject[key]);
          return expect(values, "to have items satisfying", /^[A-Z][A-Z_]*$/);
        }
      )
      .addAssertion(
        "<object> to have matching keys and values",
        (expect, subject) => {
          const values = Object.keys(subject).map(key => subject[key]);
          return expect(values, "to equal", Object.keys(subject));
        }
      )
      .addAssertion("<object> to have valid constants", (expect, subject) => {
        return expect(
          subject,
          "to satisfy",
          expect
            .it("to only have uppercase keys")
            .and("to only have uppercase strings as values")
            .and("to have matching keys and values")
        );
      });
  }
};

const expect = unexpected.clone().use(unexpectedRedux);

export default expect;
