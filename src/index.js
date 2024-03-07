import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";
import ENV from "./env/index.js";

dotenv.config({
  path: "./.env",
});

const PORT = ENV.PORT;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}!`);
    });
  })
  .catch((error) => {
    console.error("MONGODB connection failed: ", error);
  });

/* (async () => {
  try { 
    await mongoose.connect(`${ENV.MONGODB_URL}/${DB_NAME}`);

    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(PORT || 8000, () =>
      console.log(`App listening on port ${PORT}!`)
    );
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
 */
