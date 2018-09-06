import { Component, OnInit, ViewChild, NgZone, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Content } from '@ionic/angular';

import { get as _get } from 'lodash';
import { SoundEngineService, MonophonicSynth } from '../services/sound-engine.service';

type EKeyColor = 'black' | 'white';

type TKeyboard = { [s in EKeyColor]: TKeyInfo[] };


interface TKeyInfo {
  pitch: number;
  name: string;
  synth?: MonophonicSynth;

}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit {

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


  @ViewChild(Content) content: Content;


  constructor(private ses: SoundEngineService) { }

  ngAfterViewInit(): void {
    _get(this, 'content', { scrollToBottom: () => { } }).scrollToBottom();
  }

  /**
   * trigger
   */
  public trigger(key: TKeyInfo) {
    this.stopNote(key);

    const synth = this.ses.createMonophonicSynth(key.pitch * Math.pow(2, this.octave), {
      oscillatorType: 'sawtooth',
      filterType: 'lowpass',
      hzCutoff: this.hzCutoff,
      resonance: this.resonance,
      attack: this.attack,
      decay: this.decay,
      sustain: this.sustain,
      release: this.release,
      modAmount: Math.sign(this.modAmount) * Math.pow(2, Math.abs(this.modAmount) / 12.0)
    });

    key.synth = synth;
    synth.oscillator.start();
  }

  /**
   * releaseKey
   */
  public releaseKey(key: TKeyInfo) {
    this.stopNote(key);
  }

  private stopNote(key: TKeyInfo) {
    if (key.synth) {
      key.synth.stop();
    }

    key.synth = undefined;
  }

  public get hzCutoff(): number {
    return 40 * Math.pow(2, this.cutoff);
  }

}
