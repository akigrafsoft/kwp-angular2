import {Directive, ElementRef, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {NgModel} from '@angular/forms';

declare var google: any;

@Directive({
  selector: '[kwp-googleplace]',
  providers: [NgModel],
  host: {
    '(input)': 'onInputChange()'
  }
})
export class GoogleplaceDirective implements OnInit {

  @Input('kwp-googleplace') options: any;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();

  // autocomplete: any;
  // searchBox: any;
  private _el: HTMLElement;

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
  }

  ngOnInit() {
    if (typeof google === 'undefined') {
      console.error('Googleplace|Google API not loaded');
      return;
    }

    //        console.debug("Googleplace::ngOnInit()|" + JSON.stringify(this.options));
    const autocomplete = new google.maps.places.Autocomplete(this._el, this.options);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.warn('Googleplace|Autocomplete\'s returned place contains no geometry');
        this.invokeEvent(null);
        return;
      }
      this.invokeEvent(place);
    });

    // search box actually does not take same option and does not allow to restrict...
    //        var searchBox = new google.maps.places.SearchBox(this._el, this.options);
    //        google.maps.event.addListener(searchBox, 'place_changed', () => {
    //            var place = searchBox.getPlaces()[0];
    //            console.info("Googleplace|place="+JSON.stringify(place));
    //            if (!place.geometry) return;
    //            this.invokeEvent(place);
    //        });

  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }

  onInputChange() {
  }
}
