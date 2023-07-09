import { Agent, CaptureErrorCallback, ParameterizedMessageObject } from "elastic-apm-node";

export interface IApmAdapter {
    get Agent(): Agent | undefined
    captureError(err: Error | string | unknown |  ParameterizedMessageObject,
        callback?: CaptureErrorCallback): void
}