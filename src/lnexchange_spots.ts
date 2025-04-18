// @ts-ignore
import { SPOTAPI, PERPAPI, Singer } from "lnexchange-api-test";

export function createSpotApi(spotApiEnv: any) {
    const singer = spotApiEnv?.privateKey ? new Singer({
        privateKey: spotApiEnv?.privateKey,
    }) : undefined;

    const spotApi = new SPOTAPI({
        ...spotApiEnv,
        singer: spotApiEnv?.privateKey ? singer : spotApiEnv?.singer,
    });

    return spotApi;
}

