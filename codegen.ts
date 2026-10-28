import { CodegenConfig } from "@graphql-codegen/cli";
import Config from "./src/common/config.json";

const config: CodegenConfig = {
  schema: [{ [Config.API.CcreAPI]: { headers: { Authorization: "Bearer " + process.env.SCREEN_API_KEY! } } }],
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/common/types/generated/": {
      preset: "client",
      plugins: [],
      // Apollo adds __typename to every selection at runtime, so type it as always present.
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
      },
      presetConfig: {
        gqlTagName: "gql",
        // No GraphQL fragments are defined in this codebase, so the fragment-masking
        // helpers (useFragment/makeFragmentData/isFragmentReady) are dead surface.
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
