"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const dbConfig_1 = __importDefault(require("./dbConfig/dbConfig"));
const app_1 = require("./app");
(0, dbConfig_1.default)()
    .then(() => {
    app_1.app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.log('MongoDB connection failed', err);
});
