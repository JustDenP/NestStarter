import { IS_PUBLIC_KEY_META } from '@common/@types/constants/metadata';
import { applyDecorators, SetMetadata } from '@nestjs/common';

/**
 * It sets a metadata key "isPublic" to true
 */
const publicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY_META, true);

export const Public = () => applyDecorators(publicAuthMiddleware);
