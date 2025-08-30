import React from "react";
import { useMutation } from "./useMutation";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default (storybook) => {
  storybook("demo", () => {
    async function demoMutation(networkInterface, shouldSucceed) {
      await delay(1500);

      if (shouldSucceed) {
        return {
          foo: "hello world",
        };
      }

      throw new Error("Failure!");
    }

    function DemoStory() {
      const [runMutation, state] = useMutation(demoMutation);

      if (state.loading) {
        return <p>Loading...</p>;
      }

      if (state.errored) {
        return (
          <>
            <p>Mutation failed!</p>
            <pre>{state.error.message}</pre>
          </>
        );
      }

      const controls = (
        <div>
          <button onClick={() => runMutation(true)}>
            Run working mutation
          </button>
          <button onClick={() => runMutation(false)}>
            Run failing mutation
          </button>
        </div>
      );

      if (state.requested) {
        return (
          <>
            {controls}
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
          </>
        );
      }

      return controls;
    }

    return <DemoStory />;
  });
};
