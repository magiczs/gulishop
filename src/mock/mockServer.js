import mock from "mockjs";
import banner from "./banner.json";
import floor from "./floor.json";
mock.mock("/mock/banner", { code: 200, data: banner });
mock.mock("/mock/floor", { code: 200, data: floor });
