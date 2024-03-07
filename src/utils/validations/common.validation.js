import { z } from "zod";
import { Types as MongooseTypes } from "mongoose";

// Destructure ObjectId from Mongoose Types
const { ObjectId } = MongooseTypes;

const objectIdSchema = z.instanceof(ObjectId);

export { objectIdSchema };
