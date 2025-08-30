import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Button from "./Button";

storiesOf("Components/Button", module)
  .add("default", () => <Button onClick={action("clicked")}>Default</Button>)
  .add("Disabled button", () => (
    <Button onClick={action("clicked")} disabled>
      Disabled
    </Button>
  ))
  .add("Secondary button", () => (
    <Button variant="dark" onClick={action("clicked")}>
      Secondary
    </Button>
  ))
  .add("Ghost button", () => (
    <Button variant="ghost" onClick={action("clicked")}>
      Critical
    </Button>
  ))
  .add("Critical button", () => (
    <Button variant="critical" onClick={action("clicked")}>
      Critical
    </Button>
  ))
  .add("Small button", () => (
    <Button size="small" onClick={action("clicked")}>
      Small size
    </Button>
  ))
  .add("link button", () => (
    <Button variant="link" onClick={action("clicked")}>
      Link
    </Button>
  ))
  .add("dark rounded button", () => (
    <Button variant={["dark", "rounded"]} onClick={action("clicked")}>
      Link
    </Button>
  ))
  .add("all together", () => (
    <>
      <Button onClick={action("clicked")}>Default</Button>
      <Button onClick={action("clicked")} disabled>
        Disabled
      </Button>
      <Button variant="ghost" onClick={action("clicked")}>
        Link
      </Button>
      <Button variant="dark" onClick={action("clicked")}>
        Secondary
      </Button>
      <Button variant="critical" onClick={action("clicked")}>
        Critical
      </Button>
      <Button size="small" onClick={action("clicked")}>
        Small size
      </Button>
      <Button variant="link" onClick={action("clicked")}>
        Link
      </Button>
      <Button variant={["dark", "rounded"]} onClick={action("clicked")}>
        Link
      </Button>
    </>
  ));
