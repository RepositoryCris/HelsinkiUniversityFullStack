const config = require("./utils/config");
const app = require("./app"); // the actual Express application
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
