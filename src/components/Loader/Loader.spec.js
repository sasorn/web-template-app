import expect from "../../testUtils/unexpected-react";
import React from "react";

import Loader from "./Loader";

describe("Loader", () => {
  it("should exactluy render", () => {
    expect(
      <Loader />,
      "when mounted",
      "to exhaustively satisfy",
      <div className="Loader">
        <span>
          <img src="loading.svg" alt="Loading..." />
        </span>
      </div>
    );
  });
});
