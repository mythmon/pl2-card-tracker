import { shallow } from "enzyme";
import * as React from "react";

import { makeTestStore } from "../testUtils/store";
import MetaControls from "./MetaControls";

describe("connect(MetaControls)", () => {
  it("should work without errors", () => {
    const store = makeTestStore();
    shallow(<MetaControls store={store} />);
  });
});
