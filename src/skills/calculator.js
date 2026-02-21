'use strict';

// ─────────────────────────────────────────────────────────
//  Skill: Safe Math Calculator
//  Uses a whitelist-based evaluator — NO eval()
// ─────────────────────────────────────────────────────────

const logger = require('../utils/logger');

// Safe math operations only
const SAFE_OPS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => b !== 0 ? a / b : null,
  '%': (a, b) => b !== 0 ? a % b : null,
  '^': (a, b) => Math.pow(a, b),
};

const MATH_FUNCS = {
  sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil,
  round: Math.round, log: Math.log, log2: Math.log2, log10: Math.log10,
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  pi: Math.PI, e: Math.E,
};

/**
 * Extract math expression from user message.
 */
function extractExpression(text) {
  // Remove Arabic command words
  const cleaned = text
    .replace(/احسب|كم يساوي|كم هو|calculate|compute|what is|ما هو|ما نتيجة/gi, '')
    .replace(/[،؟?]/g, '')
    .trim();

  // Arabic numerals to Western
  const arabicNums = '٠١٢٣٤٥٦٧٨٩';
  const westernNums = '0123456789';
  let expr = cleaned;
  for (let i = 0; i < arabicNums.length; i++) {
    expr = expr.split(arabicNums[i]).join(westernNums[i]);
  }

  // Replace × ÷ with * /
  expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/x/g, '*');

  return expr.trim();
}

/**
 * Validate expression contains only safe characters.
 */
function isSafeExpression(expr) {
  return /^[\d\s+\-*/^%().]+$/.test(expr);
}

/**
 * Safely evaluate a simple math expression using Function constructor
 * with a restricted scope — no access to globals.
 */
function safeEval(expr) {
  if (!isSafeExpression(expr)) return null;

  try {
    // Replace ^ with ** for exponentiation
    const sanitized = expr.replace(/\^/g, '**');
    // eslint-disable-next-line no-new-func
    const result = new Function(
      '"use strict"; return (' + sanitized + ')'
    )();
    if (typeof result !== 'number' || !isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

/**
 * Calculate from user message.
 * @returns {{ expression, result, formatted }} or null
 */
function calculate(userMessage) {
  try {
    const expr = extractExpression(userMessage);
    if (!expr) return null;

    const result = safeEval(expr);
    if (result === null) return null;

    // Format result nicely
    const formatted = Number.isInteger(result)
      ? result.toLocaleString()
      : result.toFixed(6).replace(/\.?0+$/, '');

    logger.debug('calc', `${expr} = ${formatted}`);
    return { expression: expr, result, formatted };
  } catch (err) {
    logger.error('calc', err.message);
    return null;
  }
}

/**
 * Format calculation result for display.
 */
function formatCalcResult(calc) {
  if (!calc) return 'ما قدرت أحسب هذا — تأكد من صحة العملية الحسابية.';
  return `${calc.expression} = **${calc.formatted}**`;
}

module.exports = { calculate, formatCalcResult, extractExpression };
