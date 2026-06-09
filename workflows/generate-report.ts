import { type FlueContext, type WorkflowRouteHandler } from '@flue/runtime';
import * as v from 'valibot';
import bizIntelAgent from '../agents/biz-intel';

// Hono middleware to expose this workflow via HTTP
export const route: WorkflowRouteHandler = async (_c, next) => next();

export async function run({ init, payload }: FlueContext) {
  // Validate that the businessName is provided in the payload
  if (!payload || typeof payload !== 'object' || !('businessName' in payload)) {
    throw new Error('Missing required payload parameter: "businessName"');
  }

  const businessName = String(payload.businessName);

  // Initialize the agent harness
  const harness = await init(bizIntelAgent);
  const session = await harness.session();

  // Run the agent prompt
  const { data } = await session.prompt(
    `Perform a complete business intelligence analysis and generate the executive report for the business: "${businessName}"`,
    {
      result: v.object({
        businessName: v.string(),
        summary: v.string(),
        reportMarkdown: v.string(),
      }),
    },
  );

  return data;
}
