import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
    selector: 'ux-slider',
    templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit {

    @Input() value: SliderValue | number;
    @Input() options: SliderOptions;
    @Output() valueChange: EventEmitter<SliderValue | number> = new EventEmitter<SliderValue | number>();

    // store the values of the two thumbs
    thumbLowerValue: number = null;
    thumbUpperValue: number = null;

    // store tooltip visibility
    tooltipLowerVisible: boolean = false;
    tooltipUpperVisible: boolean = false;

    // store thumb event information
    lowerThumbState = {
        hover: false,
        drag: false
    };

    upperThumbState = {
        hover: false,
        drag: false
    };

    // store all the track colors
    trackColors: SliderTrackColors = {
        lower: '#f2f2f2',
        range: '#889baa',
        higher: '#f2f2f2'
    };

    // store thumb positions
    thumbPositions = {
        lower: 0,
        upper: 0
    };

    trackSizes = {
        lower: 0,
        range: 0,
        higher: 0
    };

    // store the order we want to display the thumbs
    thumbOrder = {
        lower: 100,
        upper: 101
    };

    // store all the ticks to display
    ticks: any[] = [];

    defaultOptions = {
        type: 'value',
        handles: {
            style: 'button',
            callout: {
                trigger: 'none',
                background: '#464646',
                color: '#fff',
                formatter: (value: number): string | number => value
            }
        },
        track: {
            height: 'wide',
            min: 0,
            max: 100,
            ticks: {
                snap: 'none',
                major: {
                    show: true,
                    steps: 10,
                    labels: true,
                    formatter: (value: number): string | number => value
                },
                minor: {
                    show: true,
                    steps: 5,
                    labels: false,
                    formatter: (value: number): string | number => value
                }
            },
            colors: {
                lower: '#f2f2f2',
                range: 'rgba(96,121,141, 0.75)',
                higher: '#f2f2f2'
            }
        }
    };

    constructor() { }

    ngOnInit() {
        this.updateOptions();
    }

    updateOptions() {

        // add in the default options that user hasn't specified
        Object.assign(this.options, this.defaultOptions, this.options);

        this.updateTrackColors();
        this.updateTicks();
    }

    updateTicks() {

        // get tick options
        let majorOptions = this.options.track.ticks.major;
        let minorOptions = this.options.track.ticks.minor;

        // check if we should show ticks
        if (majorOptions.show === false && minorOptions.show === false) {
            this.ticks = [];
        }

        // create ticks for both major and minor
        let majorTicks = this.getTicks(majorOptions, 'major');
        let minorTicks = this.getTicks(minorOptions, 'minor');

        // remove any minor ticks that are on a major interval
        this.ticks = this.unionTicks(majorTicks, minorTicks);
    }

    updateTrackColors() {

        // get colors for each part of the track
        var lower = this.options.track.colors.lower;
        var range = this.options.track.colors.range;
        var higher = this.options.track.colors.higher;

        // update the controller value
        this.trackColors.lower = typeof lower === 'string' ? lower : `linear-gradient(to right, ${lower.join(', ')})`;
        this.trackColors.range = typeof range === 'string' ? range : `linear-gradient(to right, ${range.join(', ')})`;
        this.trackColors.higher = typeof higher === 'string' ? higher : `linear-gradient(to right, ${higher.join(', ')})`;
    }

    getSteps(steps: number | number[]): number[] {

        // if they are already an array just return it
        if (Array.isArray(steps)) {
            return steps;
        }

        let output: number[] = [];

        // otherwise calculate the steps
        for (let idx = this.options.track.min; idx <= this.options.track.max; idx += steps) {
            output.push(idx);
        }

        return output;
    }

    getTicks(options: SliderTickOptions, type: 'major' | 'minor'): SliderTick[] {

        // create an array to store the ticks and step points
        let steps = this.getSteps(options.steps);

        // get some chart options
        let min = this.options.track.min;
        let max = this.options.track.max;

        // convert each step to a slider tick and remove invalid ticks
        return steps.map(step => {
            return {
                showTicks: options.show,
                showLabels: options.labels,
                type: type,
                position: ((step - min) / (max - min)) * 100,
                value: step,
                label: options.formatter(step)
            };
        }).filter(tick => tick.position >= 0 && tick.position <= 100);
    }

    unionTicks(majorTicks: SliderTick[], minorTicks: SliderTick[]): SliderTick[] {

        // get all ticks combined removing any minor ticks with the same value as major ticks
        return majorTicks.concat(minorTicks)
            .filter((tick, index, array) => tick.type === 'major' || !array.find(tk => tk.type === 'major' && tk.position === tick.position))
            .sort((t1, t2) => t1.value - t2.value);
    }
}

export interface SliderValue {
    min: number;
    max: number;
}

export interface SliderOptions {
    type?: 'value' | 'range';
    handles?: {
        style?: 'button' | 'line';
        callout?: {
            trigger?: 'none' | 'hover' | 'drag' | 'persistent';
            background?: string;
            color?: string;
            formatter?: (value: number) => string | number;
        };
    };
    track?: {
        height?: 'wide' | 'narrow';
        min?: number;
        max?: number;
        ticks?: {
            snap?: 'none' | 'major' | 'minor' | 'all';
            major?: SliderTickOptions;
            minor?: SliderTickOptions;
        };
        colors?: SliderTrackColors;
    };
}

interface SliderTickOptions {
    show?: boolean;
    steps?: number | number[];
    labels?: boolean;
    formatter?: (value: number) => string | number;
}

interface SliderTick {
    showTicks: boolean;
    showLabels: boolean;
    type: 'major' | 'minor';
    position: number;
    value: number;
    label: string | number;
}

interface SliderTrackColors {
    lower: string | string[];
    range: string | string[];
    higher: string | string[];
}