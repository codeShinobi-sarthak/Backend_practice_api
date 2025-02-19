import aj from "../config/arcject.js";

const arcjetMIddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Bot detected" });
            }

            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Rate limit exceeded" });
            }

            return res.status(403).json({ message: "Access denied" });
        }

        next();
    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
};

export default arcjetMIddleware;
