import { Component, Input, EventEmitter, Output, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
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
    sliderThumb = SliderThumb;
    sliderTickType = SliderTickType;
    sliderThumbEvent = SliderThumbEvent;

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

    tooltips = {
        lower: false,
        upper: false
    };

    thumbState = {
        lower: {
            hover: false,
            drag: false
        },
        upper: {
            hover: false,
            drag: false
        }
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
        this.initObservables();

        this.updateOptions();
        this.updateValues();

        this.setThumbState(SliderThumb.Lower, false, false);
        this.setThumbState(SliderThumb.Upper, false, false);
    }

    getValue(thumb: SliderThumb): string | number {

        // if a single value slider call the formatter function on the number
        if (this.options.type === SliderType.Value) {
            return this.options.handles.callout.formatter(this.value as number);
        }

        // inform typescript that the value will have a low and high property
        this.value = this.value as SliderValue;

        // otherwise return the output for the specific thumb
        if (thumb === SliderThumb.Lower) {
            return this.options.handles.callout.formatter(this.value.low);
        } else {
            return this.options.handles.callout.formatter(this.value.high);            
        }
    }

    private initObservables(): void {

        // when a user begins to drag lower thumb - subscribe to mouse move events until the mouse is lifted
        this.lowerThumbDown$ = Observable.fromEvent(this.lowerThumb.nativeElement, 'mousedown');
        this.lowerThumbDown$.switchMap(() => this.mouseMove$.takeUntil(this.mouseUp$)).subscribe((event: MouseEvent) => {
            this.updateThumbPosition(event, SliderThumb.Lower);
        });

        // when a user begins to drag upper thumb - subscribe to mouse move events until the mouse is lifted
        this.upperThumbDown$ = Observable.fromEvent(this.upperThumb.nativeElement, 'mousedown');
        this.upperThumbDown$.switchMap(() => this.mouseMove$.takeUntil(this.mouseUp$)).subscribe((event: MouseEvent) => {
            this.updateThumbPosition(event, SliderThumb.Upper);
        });
    }

    private getThumbState(thumb: SliderThumb) {
        return thumb ? this.thumbState.lower : this.thumbState.upper;
    }

    private setThumbState(thumb: SliderThumb, hover: boolean, drag: boolean) {
        if (thumb === SliderThumb.Lower) {
            this.thumbState.lower = { hover: hover, drag: drag };
        } else {
            this.thumbState.upper = { hover: hover, drag: drag };            
        }
    }

    @HostListener('document:mouseup', [])
    private onDragEnd() {
        // update thumb state here as we are not dragging any more
        this.thumbEvent(SliderThumb.Lower, SliderThumbEvent.DragEnd);
        this.thumbEvent(SliderThumb.Upper, SliderThumbEvent.DragEnd);
    }

    thumbEvent(thumb: SliderThumb, event: SliderThumbEvent): void {

        // get the current thumb state
        let state = this.getThumbState(thumb);

        // update based upon event
        switch (event) {

            case SliderThumbEvent.DragStart:
                state.drag = true;
                break;

            case SliderThumbEvent.DragEnd:
                state.drag = false;
                break;
            
            case SliderThumbEvent.MouseOver:
                state.hover = true;
                break;

            case SliderThumbEvent.MouseLeave:
                state.hover = false;
                break;

            case SliderThumbEvent.None:
                state.drag = false;
                state.hover = false;
                break;
        }

        // update the thumb state
        this.setThumbState(thumb, state.hover, state.drag);

        // update the visibility of the tooltips
        this.updateTooltips(thumb);
    }

    private updateTooltips(thumb: SliderThumb): void {

        let visible = false;
        let state = this.getThumbState(thumb);

        switch (this.options.handles.callout.trigger) {          

            case SliderCalloutTrigger.Persistent:
                visible = true;
                break;

            case SliderCalloutTrigger.Drag:
                visible = state.drag;
                break;

            case SliderCalloutTrigger.Hover:
                visible = state.hover || state.drag;
                break;
        }

        // update the state for the corresponding thumb
        if (thumb === SliderThumb.Lower) {
            this.tooltips.lower = visible;
        } else {
            this.tooltips.upper = visible;
        }

    }

    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    private updateThumbPosition(event: MouseEvent | TouchEvent, thumb: SliderThumb): void {

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
            if (thumb === SliderThumb.Lower) {
                this.value.low = value;
            } else {
                this.value.high = value;
            }
        }

        this.updateOrder(thumb);
        this.updateValues();
    }

    private updateOrder(thumb: SliderThumb): void {

        // The most recently used thumb should be above
        if (thumb === SliderThumb.Lower) {
            this.thumbOrder.lower = 101;
            this.thumbOrder.upper = 100;
        } else {
            this.thumbOrder.lower = 100;
            this.thumbOrder.upper = 101;
        }

    }

    private snapToTick(value: number, thumb: SliderThumb): number {

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
            if (thumb === SliderThumb.Lower) {
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

    private validatePosition(value: number, thumb: SliderThumb): number {

        // if slider is not a range value is always valid
        if (this.options.type === SliderType.Value) {
            return value;
        }

        // value will not be a number at this stage
        this.value = this.value as SliderValue;

        // otherwise we need to check to make sure lower thumb cannot go above higher and vice versa
        if (thumb === SliderThumb.Lower) {
            return value <= this.value.high ? value : this.value.high;
        }

        if (thumb === SliderThumb.Upper) {
            return value >= this.value.low ? value : this.value.low;
        }
    }

    private updateOptions() {

        // add in the default options that user hasn't specified
        // Object.assign(this.options, this.defaultOptions, this.options);
        this.deepMerge(this.options, this.defaultOptions);

        this.updateTrackColors();
        this.updateTicks();
        this.updateValues();
    }

    private updateValues() {

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

    private updateTicks() {

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

    private updateTrackColors() {

        // get colors for each part of the track
        var lower = this.options.track.colors.lower;
        var range = this.options.track.colors.range;
        var higher = this.options.track.colors.higher;

        // update the controller value
        this.trackColors.lower = typeof lower === 'string' ? lower : `linear-gradient(to right, ${lower.join(', ')})`;
        this.trackColors.range = typeof range === 'string' ? range : `linear-gradient(to right, ${range.join(', ')})`;
        this.trackColors.higher = typeof higher === 'string' ? higher : `linear-gradient(to right, ${higher.join(', ')})`;
    }

    private getSteps(steps: number | number[]): number[] {

        // if they are already an array just return it
        if (steps instanceof Array) {
            return steps;
        }

        let output: number[] = [];

        // otherwise calculate the steps
        for (let idx = this.options.track.min; idx <= this.options.track.max; idx += steps) {
            output.push(idx);
        }

        return output;
    }

    private getTicks(options: SliderTickOptions, type: SliderTickType): SliderTick[] {

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

    private unionTicks(majorTicks: SliderTick[], minorTicks: SliderTick[]): SliderTick[] {

        // get all ticks combined removing any minor ticks with the same value as major ticks
        return majorTicks.concat(minorTicks)
            .filter((tick, index, array) => tick.type === SliderTickType.Major || !array.find(tk => tk.type === SliderTickType.Major && tk.position === tick.position))
            .sort((t1, t2) => t1.value - t2.value);
    }

    private deepMerge(destination: any, source: any) {

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

enum SliderThumbEvent {
    None,
    MouseOver,
    MouseLeave,
    DragStart,
    DragEnd
}

enum SliderThumb {
    Lower,
    Upper
}