import { Magic } from "magic-sdk";

export const magic = new Magic(
	process.env.NEXT_PUBLIC_MAGIC_PUB_KEY as string,
	{
		testMode: true,
	}
);
