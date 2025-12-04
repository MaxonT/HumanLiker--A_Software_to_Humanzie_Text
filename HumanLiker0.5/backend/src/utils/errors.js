/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
  constructor(code, message, statusCode = 500, details = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details
      }
    };
  }
}

export class ValidationError extends AppError {
  constructor(message, details = {}) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super('NOT_FOUND', `${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ModelError extends AppError {
  constructor(message, details = {}) {
    super('MODEL_ERROR', message, 503, details);
    this.name = 'ModelError';
  }
}

export class DatabaseError extends AppError {
  constructor(message, details = {}) {
    super('DATABASE_ERROR', message, 500, details);
    this.name = 'DatabaseError';
  }
}

/**
 * Error handler middleware helper
 */
export function handleError(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Unknown error
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    }
  });
}


