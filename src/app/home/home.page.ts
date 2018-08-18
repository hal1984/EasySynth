import { Component, OnInit } from '@angular/core';

type EKeyColor = 'black' | 'white';

type TKeyboard = { [s in EKeyColor]: TKeyInfo[] };

interface TKeyInfo {
  pitch: number;
  name: string;
  oscillator?: OscillatorNode;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

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
  public audioCtx: AudioContext;
  public gainNode: GainNode;

  ngOnInit(): void {
    this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
  }
  /**
   * trigger
   */
  public trigger(key: TKeyInfo) {
    this.stopKey(key);

    const oscillator = this.audioCtx.createOscillator();
    oscillator.connect(this.gainNode);
    oscillator.type = 'square';
    oscillator.frequency.value = key.pitch * Math.pow(2, this.octave);
    key.oscillator = oscillator;
    key.oscillator.start();
  }

  /**
   * release
   */
  public release(key: TKeyInfo) {
    this.stopKey(key);
  }

  private stopKey(key: TKeyInfo) {
    if (key.oscillator) {
      key.oscillator.stop();
      delete key.oscillator;
    }
  }
}
