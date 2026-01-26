import { analyzeCodeSnippet } from "../../core/ai/ai.suggestions.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import AppError from "../../core/utils/AppError.js";

export const analyzeFile = catchAsync(async (req, res, next) => {
    const { fileName, code } = req.body;

    if (!fileName || !code) {
        return next(new AppError("FileName and code are required", 400));
    }

    console.log(`Analyzing file: ${fileName}`);

    try {
        const suggestions = await analyzeCodeSnippet(fileName, code);

        res.json({
            success: true,
            suggestions
        });
    } catch (error) {
        return next(new AppError("Failed to analyze code", 500));
    }
});
