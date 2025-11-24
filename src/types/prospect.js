/**
 * @fileoverview Prospect type definition for the investor prospecting system
 * 
 * This is the unified shape used across the app and OpenAI prompts,
 * regardless of source (OpenVC, AngelMatch, internal CSV, etc.)
 */

/**
 * @typedef {Object} Prospect
 * @property {string} id                 // stable id in your system
 * @property {string} name               // investor or firm name
 * @property {string} [firm]             // optional firm/organization if name is a person
 * @property {string} [website]
 * @property {string} [hqRaw]            // raw HQ text from CSV
 * @property {string[]} countries        // where they invest
 * @property {string[]} stages           // normalized investment stages
 * @property {string} [thesis]          // Investment thesis / description
 * @property {('vc'|'solo_angel'|'angel_network'|'corporate_vc'|'family_office'|'accelerator'|'pe'|'public_fund'|'revenue_based'|'other')} investorType
 * @property {number|null} minCheckUsd   // in USD, numeric (optional, can be null)
 * @property {number|null} maxCheckUsd   // in USD, numeric (optional, can be null)
 * @property {string} source             // 'openvc' | 'angelmatch' | 'manual'
 * @property {string} sourceId           // e.g. row index, external id, etc.
 * @property {number} [score]            // your internal "fit" score
 * @property {Object} raw                // original raw row for debugging
 * @property {string[]} [markets]        // market sectors (from AngelMatch CSV "markets" field)
 * @property {string[]} [sectors]        // alias for markets, used in dashboard
 * @property {string} [email]            // primary email (first from CSV "emails" field)
 * @property {string} [phone]            // phone number
 * @property {string} [linkedin]         // LinkedIn profile URL/username
 * @property {string} [twitter]          // Twitter handle/URL (optional)
 * @property {string} [title]            // job title (optional)
 * @property {string[]} [portfolio]      // array of portfolio company names (from CSV "pastInvestments")
 */

export {};

