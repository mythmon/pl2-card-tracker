import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

enzyme.configure({ adapter: new Adapter() });

const originalError = console.error;
const originalWarn = console.warn;

console.warn = (...args) => {
  originalWarn.apply(console, args);
  throw new Error("console.warn should not be called during tests");
};

console.error = (...args) => {
  originalError.apply(console, args);
  throw new Error("console.error should not be called during tests");
};
