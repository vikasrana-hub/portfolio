// AudioWorklet processor: captures raw PCM float32 samples from the mic
// and posts them to the main thread for WebSocket streaming.
class PCMProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._bufferSize = 4096; // ~85ms at 48kHz — good balance
        this._buffer = new Float32Array(this._bufferSize);
        this._bytesWritten = 0;
    }

    process(inputs) {
        const input = inputs[0];
        if (!input || !input[0]) return true;

        const channelData = input[0]; // mono channel

        for (let i = 0; i < channelData.length; i++) {
            this._buffer[this._bytesWritten++] = channelData[i];

            if (this._bytesWritten >= this._bufferSize) {
                // Send the accumulated buffer to the main thread
                this.port.postMessage(this._buffer.slice());
                this._bytesWritten = 0;
            }
        }

        return true;
    }
}

registerProcessor('pcm-processor', PCMProcessor);
