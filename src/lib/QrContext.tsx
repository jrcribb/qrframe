import { ByteEncoder, FuqrError, Mask, generateWithEncoder, type Ecl } from "fuqr";
import { AlphanumericEncoder, MixedEncoder, NumericEncoder } from "fuqr/extras/encoders";
import { createContext, createMemo, useContext, type Accessor, type JSX } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";
import type { EncoderName } from "./options";

type InputQr = {
  text: string;
  minVersion: number;
  exactVersion: boolean;
  minEcl: Ecl;
  exactEcl: boolean;
  encoder: EncoderName;
  mask: Mask;
};

export type OutputQr = Readonly<{
  text: string;
  version: number;
  ecl: Ecl;
  mask: Mask;
  matrix: Uint8Array;
}>;

type Output =
  | {
      text: string;
      qr: {
        version: number;
        ecl: Ecl;
        mask: Mask;
        matrix: Uint8Array;
      };
      err: null;
    }
  | {
      text: string;
      qr: null;
      err: FuqrError;
    };

export const QrContext = createContext<{
  inputQr: InputQr;
  setInputQr: SetStoreFunction<InputQr>;
  output: Accessor<Output>;
}>();

export function QrContextProvider(props: { children: JSX.Element }) {
  const [inputQr, setInputQr] = createStore<InputQr>({
    text: "https://qrframe.kylezhe.ng",
    minVersion: 1,
    exactVersion: false,
    minEcl: 0,
    exactEcl: false,
    encoder: "Optimizing",
    mask: 2,
  });

  const output = createMemo(() => {
    try {
      let encoder;
      switch (inputQr.encoder) {
        case "Byte":
          encoder = new ByteEncoder(inputQr.text);
          break;
        case "Numeric":
          for (let i = 0; i < inputQr.text.length; i++) {
            const byte = inputQr.text.charCodeAt(i);
            if (byte < 0x30 || 0x39 < byte) {
              throw new FuqrError("INVALID_ENCODING", `Content is not numeric`);
            }
          }
          encoder = new NumericEncoder(inputQr.text);
          break;
        case "Alphanumeric":
          for (let i = 0; i < inputQr.text.length; i++) {
            const byte = inputQr.text.charCodeAt(i);
            if (AlphanumericEncoder.byteToB45(byte) === 255) {
              throw new FuqrError("INVALID_ENCODING", `Content is not alphanumeric`);
            }
          }
          encoder = new AlphanumericEncoder(inputQr.text);
          break;
        default:
          encoder = new MixedEncoder(inputQr.text);
      }
      const qr = generateWithEncoder(encoder, {
        minVersion: inputQr.minVersion,
        maxVersion: inputQr.exactVersion ? inputQr.minVersion : 40,
        minEcl: inputQr.minEcl,
        maxEcl: inputQr.exactEcl ? inputQr.minEcl : 3,
        mask: inputQr.mask,
      });
      return {
        text: inputQr.text,
        qr,
        err: null,
      };
    } catch (e) {
      return {
        text: inputQr.text,
        qr: null,
        err: e as FuqrError,
      };
    }
  });

  return (
    <QrContext.Provider
      value={{
        inputQr,
        setInputQr,
        output,
      }}
    >
      {props.children}
    </QrContext.Provider>
  );
}

export function useQrContext() {
  const context = useContext(QrContext);
  if (!context) {
    throw new Error("useQrContext: used outside QrContextProvider");
  }
  return context;
}
