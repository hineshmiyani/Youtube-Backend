/* ✅ Async handler using promises */
const asyncHandler = (requestHandler) => {
  return (req, res, next) =>
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
};

export { asyncHandler };

/* ✅ Async handler using try-catch and async-await  */
// const asyncHandler = (fn) => {
//   return async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.status(error?.code || 500).json({
//         success: false,
//         message: error?.message,
//       });
//     }
//   };
// };
