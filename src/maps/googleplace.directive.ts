import { Directive, ElementRef, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

declare var google: any;

@Directive({
    selector: '[googleplace]',
    providers: [NgModel],
    host: {
        '(input)': 'onInputChange()'
    }
})
export class GoogleplaceDirective implements OnInit {

    @Input('googleplace') options: any;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();

    autocomplete: any;
    private _el: HTMLElement;

    constructor(el: ElementRef) {
        this._el = el.nativeElement;
    }

    ngOnInit() {
        if (typeof google === 'undefined') {
            console.error("GoogleplaceDirective|Google API not loaded");
            return;
        }

        console.log("GoogleplaceDirective|" + JSON.stringify(this.options));
        this.autocomplete = new google.maps.places.Autocomplete(this._el, this.options);
        google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
            var place = this.autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

    onInputChange() {
    }
}