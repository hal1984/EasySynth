import { Injectable, OnInit } from '@angular/core';

interface ISynthOptions {
  oscillatorType: OscillatorType;
  filterType: BiquadFilterType;

  hzCutoff: number;
  resonance: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  modAmount: number;

}

export class MonophonicSynth {
  readonly filter: BiquadFilterNode;
  readonly oscillator: OscillatorNode;
  interval: NodeJS.Timer;

  constructor(private audioCtx: AudioContext, private options: ISynthOptions) {

    this.oscillator = audioCtx.createOscillator();
    this.oscillator.type = options.oscillatorType;

    this.filter = audioCtx.createBiquadFilter();
    this.filter.type = options.filterType;

    this.oscillator.connect(this.filter);

    this.interval = setInterval(() => {
      console.log(this.filter.frequency);
    }, 100);
  }

  connect(audioNode: AudioNode) {
    this.filter.connect(audioNode);
  }

  play() {
    this.oscillator.start();
  }

  stop() {
    const releaseEnd = this.audioCtx.currentTime;

    this.filter.frequency.setTargetAtTime(0, releaseEnd, this.options.release / 4000.0);
    setTimeout(() => {
      this.filter.frequency.cancelScheduledValues(releaseEnd);
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.filter.disconnect();
      clearInterval(this.interval);
    }, this.options.release);

  }
}


@Injectable({
  providedIn: 'root'
})
export class SoundEngineService {

  public audioCtx: AudioContext;
  public gainNode: GainNode;
  constructor() {
    this.audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
  }

  createMonophonicSynth(pitch: number, synthOptions: ISynthOptions) {

    const synth = new MonophonicSynth(this.audioCtx, synthOptions);

    synth.oscillator.frequency.value = pitch;

    const attackStart = this.audioCtx.currentTime;
    const decayStart = attackStart + synthOptions.attack / 1000.0;

    const maxCutoff = synthOptions.hzCutoff * (1 + synthOptions.modAmount);

    synth.filter.frequency.value = synthOptions.hzCutoff;
    synth.filter.frequency.setTargetAtTime(maxCutoff, attackStart, 1000.0 / synthOptions.attack);

    console.log(maxCutoff, maxCutoff * synthOptions.sustain);
    synth.filter.frequency.setTargetAtTime(maxCutoff * synthOptions.sustain, decayStart, 1000.0 / synthOptions.decay);


    synth.filter.Q.value = synthOptions.resonance;

    synth.connect(this.audioCtx.destination);

    return synth;
  }
}
