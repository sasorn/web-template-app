import expect from "../../testUtils/unexpected-react";
import React from "react";

import Button from "./Button";

describe("Button", () => {
  it("should exactly render button with text", () => {
    expect(
      <Button children="Some label of a button" />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button">Some label of a button</button>
    );
  });

  it("should render disabled button", () => {
    expect(
      <Button disabled />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button" disabled />
    );
  });

  it("should render dark button", () => {
    expect(
      <Button variant="dark" />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button dark" />
    );
  });

  it("should render critical button", () => {
    expect(
      <Button variant="critical" />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button critical" />
    );
  });

  it("should render ghost button", () => {
    expect(
      <Button variant="ghost" />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button ghost" />
    );
  });

  it("should render as a link", () => {
    expect(
      <Button variant="link" />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button link" />
    );
  });

  it("should render rounded button", () => {
    expect(
      <Button variant="rounded" />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button rounded" />
    );
  });

  it("should render critical rounded button", () => {
    expect(
      <Button variant={["critical", "rounded"]} />,
      "when mounted",
      "to exhaustively satisfy",
      <button className="Button critical rounded" />
    );
  });
});
