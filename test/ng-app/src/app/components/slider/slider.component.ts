import { Component, Input, EventEmitter, Output, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'ux-slider',
    templateUrl: './slider.component.html'
})
export class SliderComponent implements OnInit {

    @Input() value: SliderValue | number;
    @Input() options: SliderOptions;
    @Output() valueChange: EventEmitter<SliderValue | number> = new EventEmitter<SliderValue | number>();

    @ViewChild('lowerThumb') lowerThumb: ElementRef;
    @ViewChild('upperThumb') upperThumb: ElementRef;
    @ViewChild('track') track: ElementRef;

    // expose enums to Angular view
    sliderType = SliderType;
    sliderStyle = SliderStyle;
    sliderSize = SliderSize;
    sliderTickType = SliderTickType;

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
    ticks: SliderTick[] = [];

    defaultOptions: SliderOptions = {
        type: SliderType.Value,
        handles: {
            style: SliderStyle.Button,
            callout: {
                trigger: SliderCalloutTrigger.None,
                background: '#464646',
                color: '#fff',
                formatter: (value: number): string | number => value
            }
        },
        track: {
            height: SliderSize.Wide,
            min: 0,
            max: 100,
            ticks: {
                snap: SliderSnap.None,
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

    // observables for capturing movement
    private lowerThumbDown$: Observable<MouseEvent>;
    private upperThumbDown$: Observable<MouseEvent>;
    private mouseMove$: Observable<MouseEvent> = Observable.fromEvent(document, 'mousemove');
    private mouseUp$: Observable<MouseEvent> = Observable.fromEvent(document, 'mouseup');

    ngOnInit() {

        // set up event observables
        this.lowerThumbDown$ = Observable.fromEvent(this.lowerThumb.nativeElement, 'mousedown');
        this.lowerThumbDown$.switchMap(() => this.mouseMove$.takeUntil(this.mouseUp$)).subscribe((event: MouseEvent) => {
            this.updateThumbPosition(event, this.lowerThumb);
        });

        this.upperThumbDown$ = Observable.fromEvent(this.upperThumb.nativeElement, 'mousedown');
        this.upperThumbDown$.switchMap(() => this.mouseMove$.takeUntil(this.mouseUp$)).subscribe((event: MouseEvent) => {
            this.updateThumbPosition(event, this.upperThumb);
        });


        this.updateOptions();
        this.updateValues();
    }

    clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    updateThumbPosition(event: MouseEvent | TouchEvent, thumb: ElementRef) {

        // get event position - either mouse or touch
        let eventPosition = event instanceof MouseEvent ? event.clientX : event.touches && event.touches.length > 0 ? event.touches[0].clientX : null;

        // if event position is null do nothing
        if (eventPosition === null) {
            return;
        }

        // get mouse position
        let mouseX = window.pageXOffset + eventPosition;

        // get track size and position
        let trackBounds = this.track.nativeElement.getBoundingClientRect();

        // restrict the value within the range size
        let position = this.clamp(mouseX - trackBounds.left, 0, trackBounds.width);

        // get fraction representation of location within the track
        let fraction = (position / trackBounds.width);

        // convert to value within the range
        let value = ((this.options.track.max - this.options.track.min) * fraction) + this.options.track.min;

        // ensure value is valid
        value = this.validatePosition(value, thumb);

        // snap to a tick if required
        value = this.snapToTick(value, thumb);

        if (typeof this.value === 'number') {
            this.value = value;
        } else {
            if (thumb === this.lowerThumb) {
                this.value.low = value;
            } else {
                this.value.high = value;
            }
        }

        this.updateOrder(thumb);
        this.updateValues();
    }

    updateOrder(thumb: ElementRef) {

        // The most recently used thumb should be above
        if (thumb === this.lowerThumb) {
            this.thumbOrder.lower = 101;
            this.thumbOrder.upper = 100;
        } else {
            this.thumbOrder.lower = 100;
            this.thumbOrder.upper = 101;
        }

    }

    snapToTick(value: number, thumb: ElementRef) {

        // get the snap target
        let snapTarget: SliderSnap = this.options.track.ticks.snap;

        // if snap target is none then return original value
        if (snapTarget === SliderSnap.None) {
            return value;
        }

        // get filtered ticks
        let ticks: SliderTick[];

        switch (snapTarget) {

            case SliderSnap.Minor:
                ticks = this.ticks.filter(tick => tick.type === SliderTickType.Minor);
                break;

            case SliderSnap.Major:
                ticks = this.ticks.filter(tick => tick.type === SliderTickType.Major);
                break;

            default:
                ticks = this.ticks.slice(0);
        }

        // get the track limit
        let lowerLimit = this.options.track.min;
        let upperLimit = this.options.track.max;

        // if range then update the limits
        if (this.options.type === SliderType.Range) {

            // inform typescript about the type here
            this.value = this.value as SliderValue;

            // determine which thumb we are dragging
            if (thumb === this.lowerThumb) {
                upperLimit = this.value.high;
            } else {
                lowerLimit = this.value.low;
            }
        }

        // filter ticks within the allowed range
        ticks = ticks.filter(tick => tick.value >= lowerLimit && tick.value <= upperLimit);

        // find the closest tick
        let snapValue = 0,
            distance = null;

        for (let tick of ticks) {

            // calculate the distance between this ticks value and our target
            let tickDistance = Math.max(tick.value, value) - Math.min(tick.value, value);

            // if this tick is closer than the previous closest then store this new tick
            if (distance === null || tickDistance < distance) {
                distance = tickDistance;
                snapValue = tick.value;
            }
        }

        return snapValue;
    }

    validatePosition(value: number, thumb: ElementRef) {

        // if slider is not a range value is always valid
        if (this.options.type === SliderType.Value) {
            return value;
        }

        // value will not be a number at this stage
        this.value = this.value as SliderValue;

        // otherwise we need to check to make sure lower thumb cannot go above higher and vice versa
        if (thumb === this.lowerThumb) {
            return value <= this.value.high ? value : this.value.high;
        }

        if (thumb === this.upperThumb) {
            return value >= this.value.low ? value : this.value.low;
        }
    }

    updateOptions() {

        // add in the default options that user hasn't specified
        // Object.assign(this.options, this.defaultOptions, this.options);
        this.deepMerge(this.options, this.defaultOptions);

        this.updateTrackColors();
        this.updateTicks();
        this.updateValues();
    }

    updateValues() {

        let lowerValue = typeof this.value === 'number' ? this.value : this.value.low;
        let upperValue = typeof this.value === 'number' ? this.value : this.value.high;

        // calculate the positions as percentages
        let lowerPosition = (((lowerValue - this.options.track.min) / (this.options.track.max - this.options.track.min)) * 100);
        let upperPosition = (((upperValue - this.options.track.min) / (this.options.track.max - this.options.track.min)) * 100);

        // update thumb positions
        this.thumbPositions = {
            lower: lowerPosition,
            upper: upperPosition
        };

        // calculate the track sizes
        this.trackSizes = {
            lower: lowerPosition,
            range: upperPosition - lowerPosition,
            higher: this.options.type === SliderType.Value ? 100 - lowerPosition : 100 - upperPosition
        };

        // update the value input
        if (this.options.type === SliderType.Value) {
            this.value = lowerValue;
        } else {
            this.value = {
                low: lowerValue,
                high: upperValue
            };
        }

        // call the event emitter
        this.valueChange.emit(this.value);
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
        let majorTicks = this.getTicks(majorOptions, SliderTickType.Major);
        let minorTicks = this.getTicks(minorOptions, SliderTickType.Minor);

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

    getTicks(options: SliderTickOptions, type: SliderTickType): SliderTick[] {

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
            .filter((tick, index, array) => tick.type === SliderTickType.Major || !array.find(tk => tk.type === SliderTickType.Major && tk.position === tick.position))
            .sort((t1, t2) => t1.value - t2.value);
    }

    deepMerge(destination: any, source: any) {

        // loop though all of the properties in the source object
        for (let prop in source) {

            // check if the destination object has the property
            if (!destination.hasOwnProperty(prop)) {
                // copy the property across
                destination[prop] = source[prop];
                continue;
            }

            // if the property exists and is not an object then skip
            if (typeof destination[prop] !== 'object') {
                continue;
            }

            // check if property is an array
            if (destination[prop] instanceof Array) {
                continue;
            }

            // if it is an object then perform a recursive check
            destination[prop] = this.deepMerge(destination[prop], source[prop]);
        }

        return destination;
    }
}

export enum SliderType {
    Value,
    Range
}

export enum SliderStyle {
    Button,
    Line
}

export enum SliderSize {
    Narrow,
    Wide
}

export enum SliderCalloutTrigger {
    None,
    Hover,
    Drag,
    Persistent
}

export interface SliderValue {
    low: number;
    high: number;
}

export enum SliderSnap {
    None,
    Minor,
    Major,
    All
}

enum SliderTickType {
    Minor,
    Major
}

export interface SliderOptions {
    type?: SliderType;
    handles?: {
        style?: SliderStyle;
        callout?: SliderCallout;
    };
    track?: {
        height?: SliderSize;
        min?: number;
        max?: number;
        ticks?: {
            snap?: SliderSnap;
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
    type: SliderTickType;
    position: number;
    value: number;
    label: string | number;
}

interface SliderTrackColors {
    lower?: string | string[];
    range?: string | string[];
    higher?: string | string[];
}

interface SliderCallout {
    trigger?: SliderCalloutTrigger;
    background?: string;
    color?: string;
    formatter?: (value: number) => string | number;
}