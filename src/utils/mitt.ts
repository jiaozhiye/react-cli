/*
 * @Author: 焦质晔
 * @Date: 2022-04-09 12:28:22
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-02-05 13:31:56
 */
import mitt from 'mitt';
import type { Emitter, EventType, Handler } from 'mitt';
import type { Nullable } from './types';

interface IEmitter extends Emitter<Record<EventType, unknown>> {
  $on: (type: EventType, handler: Handler<any>) => void;
  $off: (type: EventType, handler?: Handler) => void;
  $emit: (type: EventType, payload: any) => void;
  $delete: (type: EventType) => void;
}

function remove(type: EventType) {
  this.all.delete(type);
}

const emitter = mitt() as IEmitter;
emitter.$off = emitter.off;
emitter.$on = emitter.on;
emitter.$emit = emitter.emit;
emitter.$delete = remove;

let microEvent: Nullable<IEmitter> = null;

const setMicroEvent = (_: IEmitter) => {
  microEvent = _;
};

const getMicroEvent = (): Nullable<IEmitter> => microEvent;

export { emitter, setMicroEvent, getMicroEvent };
