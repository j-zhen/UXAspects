import { SliderOptions } from './../../components/slider/slider.component';
import { Component } from '@angular/core';

import 'chance';

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    options: SliderOptions = {
        track: {
            ticks: {
                major: {
                    steps: [0, 50, 100],
                    labels: true,
                    formatter: (value: number) => {
                        if (value === 0) {
                            return 'Minimum';
                        }
                        if (value === 50) {
                            return 'Default';
                        }
                        if (value === 100) {
                            return 'Maximum';
                        }
                    }
                },
                minor: {
                    show: false
                }
            }
        }
    };

    constructor() {

    }
}