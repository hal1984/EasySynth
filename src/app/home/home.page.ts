import { Component, OnInit, ViewChild, NgZone, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Content } from '@ionic/angular';

import { get as _get } from 'lodash';

type EKeyColor = 'black' | 'white';

type TKeyboard = { [s in EKeyColor]: TKeyInfo[] };

interface TKeyInfo {
  pitch: number;
  name: string;
  oscillator?: OscillatorNode;
  filter?: BiquadFilterNode;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {

  public keyboard = {
    black: [{
      pitch: 277.1826, name: 'C#'
    }, {
      pitch: 311.1270, name: 'D#'
    }, null, {
      pitch: 369.9944, name: 'F#'
    }, {
      pitch: 415.3047, name: 'G#'
    }, {
      pitch: 466.1638, name: 'A#'
    }, null, {
      pitch: 554.3653, name: 'C#'
    }],
    white: [{
      pitch: 261.6256, name: 'C'
    }, {
      pitch: 293.6648, name: 'D'
    }, {
      pitch: 329.6276, name: 'E'
    }, {
      pitch: 349.2282, name: 'F'
    }, {
      pitch: 391.9954, name: 'G'
    }, {
      pitch: 440.0000, name: 'A'
    }, {
      pitch: 493.8833, name: 'B'
    }, {
      pitch: 523.2511, name: 'C'
    }]
  };

  public octave = 0;
  public attack = 0;
  public decay = 0;
  public sustain = 0;
  public release = 0;
  public cutoff = 3;
  public resonance = 0;
  public modAmount = 0;
  public audioCtx: AudioContext;
  public gainNode: GainNode;

  @ViewChild(Content) content: Content;

  ngOnInit(): void {
    this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
    this.gainNode = this.audioCtx.createGain();

    this.gainNode.connect(this.audioCtx.destination);
  }

  ngAfterViewInit(): void {
    _get(this, 'content', { scrollToBottom: () => { } }).scrollToBottom();
  }

  /**
   * trigger
   */
  public trigger(key: TKeyInfo) {
    this.stopKey(key);

    const oscillator = this.audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = key.pitch * Math.pow(2, this.octave);

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';

    const attackStart = this.audioCtx.currentTime;
    const decayStart = attackStart + this.attack / 1000.0;

    filter.frequency.setValueAtTime(this.hzCutoff, this.audioCtx.currentTime);
    filter.frequency.setTargetAtTime(this.hzCutoff + this.modAmount * 128, attackStart, this.attack / 4000.0);
    filter.frequency.setTargetAtTime(this.hzCutoff + this.modAmount * this.sustain, decayStart, this.decay / 4000.0);


    filter.Q.setValueAtTime(this.resonance, this.audioCtx.currentTime);

    oscillator.connect(filter);
    filter.connect(this.gainNode);

    key.oscillator = oscillator;
    key.filter = filter;
    key.oscillator.start();
  }

  /**
   * releaseKey
   */
  public releaseKey(key: TKeyInfo) {
    this.stopKey(key);
  }

  private stopKey(key: TKeyInfo) {
    if (key.oscillator) {

      const releaseEnd = this.audioCtx.currentTime;
      const { filter, oscillator } = key;

      filter.frequency.setTargetAtTime(0, releaseEnd, this.release / 4000);
      setTimeout(() => {
        filter.frequency.cancelScheduledValues(releaseEnd);
        oscillator.stop();
        filter.disconnect();
      }, this.release);

      delete key.oscillator;
      delete key.filter;
    }
  }

  public get hzCutoff(): number {
    return 40 * Math.pow(2, this.cutoff);
  }

}
