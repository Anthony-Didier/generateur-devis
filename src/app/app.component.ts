import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  createForm: FormGroup;

  isNextDisabled = true;

  selectedProducts: any;
  filteredProducts: any;
  products = [
    { name: "Jus d'orange (1 l)", tax: 10, price: 2.09 },
    { name: "Cidre (75 cl)", tax: 20, price: 2.50 },
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      date: ['', Validators.required],
      number: ['', Validators.required],
      place: ['', Validators.required],
      time: ['', Validators.required],
      name: ['', Validators.required],
      service: ['', Validators.required],
      po: ['', Validators.required]
    })

    this.createForm.valueChanges.subscribe((v) => {
      this.isNextDisabled = !this.createForm.valid;
    });
  }

  public onProductsSelected() {
    console.log(this.selectedProducts);
    this.filteredProducts = this.products.filter(t => t.name == this.selectedProducts);
    (<HTMLDivElement>document.getElementById("selection")).hidden = false
  }

  public downloadInvoice() {

    const date = new Date();

    let day = date.getDate();
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let year = date.getFullYear();

    let currentDate = `${day}/${month}/${year}`;

    let prestDate = new Date((<HTMLInputElement>document.getElementById("date")).value).toLocaleDateString();
    let number = (<HTMLInputElement>document.getElementById("number")).value;
    let place = (<HTMLInputElement>document.getElementById("place")).value;
    let time = (<HTMLInputElement>document.getElementById("time")).value;
    let prestation = (<HTMLSelectElement>document.getElementById("prestation")).value;
    let name = (<HTMLInputElement>document.getElementById("name")).value;
    let service = (<HTMLInputElement>document.getElementById("service")).value;
    let po = (<HTMLInputElement>document.getElementById("po")).value;

    var doc = new jsPDF();
    let img = new Image();
    img.src = "assets/eurest.png"

    doc.addImage(
      img,
      'PNG',
      (doc.internal.pageSize.width - 40) / 2,
      5,
      40,
      28
    );

    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Company brand',
    //         styles: {
    //           halign: 'left',
    //           fontSize: 20,
    //           textColor: '#ffffff'
    //         }
    //       },
    //       {
    //         content: 'Invoice',
    //         styles: {
    //           halign: 'right',
    //           fontSize: 20,
    //           textColor: '#ffffff'
    //         }
    //       }
    //     ],
    //   ],
    //   theme: 'plain',
    //   styles: {
    //     fillColor: '#3366ff'
    //   }
    // });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Devis effectué le :',
            styles: {
              halign: 'left',
              cellWidth: 73
            }
          },
          {
            content: currentDate,
            styles: {
              halign: 'left',
              fontStyle: 'bold'
            },
          }
        ],
      ],
      theme: 'plain',
      margin: { top: 40 }
    });

    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Billed to:'
    //           + '\nJohn Doe'
    //           + '\nBilling Address line 1'
    //           + '\nBilling Address line 2'
    //           + '\nZip code - City'
    //           + '\nCountry',
    //         styles: {
    //           halign: 'left'
    //         }
    //       },
    //       {
    //         content: 'Shipping address:'
    //           + '\nJohn Doe'
    //           + '\nShipping Address line 1'
    //           + '\nShipping Address line 2'
    //           + '\nZip code - City'
    //           + '\nCountry',
    //         styles: {
    //           halign: 'left'
    //         }
    //       },
    //       {
    //         content: 'From:'
    //           + '\nCompany name'
    //           + '\nShipping Address line 1'
    //           + '\nShipping Address line 2'
    //           + '\nZip code - City'
    //           + '\nCountry',
    //         styles: {
    //           halign: 'right'
    //         }
    //       }
    //     ],
    //   ],
    //   theme: 'plain'
    // });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Date de la prestation :'
              + '\nNombre de convives :'
              + '\nLieu :'
              + '\nHeure :'
              + '\nPrestation :',
            styles: {
              halign: 'left',
              fontStyle: 'bold',
              cellWidth: 73
            }
          },
          {
            content: prestDate
              + '\n' + number
              + '\n' + place
              + '\n' + time
              + '\n' + prestation,
            styles: {
              halign: 'left'
            }
          }
        ],
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      head: [['Désignation', 'Commentaires', 'Prix unitaire HT', 'Quantité', 'TVA', 'Total HT']],
      body: [
        ['Product or service name', 'Category', '$450', '2', '10 %', '$1000'],
        ['Product or service name', 'Category', '$450', '2', '10 %', '$1000'],
        ['Product or service name', 'Category', '$450', '2', '10 %', '$1000'],
        ['Product or service name', 'Category', '$450', '2', '20 %', '$1000']
      ],
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40'
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Subtotal:',
            styles: {
              halign: 'right'
            }
          },
          {
            content: '$3600',
            styles: {
              halign: 'right'
            }
          },
        ],
        [
          {
            content: 'Total tax:',
            styles: {
              halign: 'right'
            }
          },
          {
            content: '$400',
            styles: {
              halign: 'right'
            }
          },
        ],
        [
          {
            content: 'Total amount:',
            styles: {
              halign: 'right'
            }
          },
          {
            content: '$4000',
            styles: {
              halign: 'right'
            }
          },
        ],
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [[
        {
          content: 'Facturation',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
            fillColor: '#343a40',
            textColor: 'white',
          },
          colSpan: 2
        },
        {
          content: '',
          styles: {
            halign: 'left'
          }
        }
      ],
      [
        {
          content: 'Nom :'
            + '\nService :'
            + '\nCode facturation (P.O) :',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
            cellWidth: 73
          }
        },
        {
          content: name
            + '\n' + service
            + '\n' + po,
          styles: {
            halign: 'left',
            cellWidth: (doc.internal.pageSize.width - 73) - 28
          }
        }
      ],
      ],
      theme: 'plain'
    });

    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Commande effectuée par :',
    //         styles: {
    //           halign: 'left',
    //           fontStyle: 'bold',
    //           cellWidth: 73
    //         }
    //       },
    //       {
    //         content: 'Alain DIDIER',
    //         styles: {
    //           halign: 'left'
    //         }
    //       }
    //     ],
    //   ],
    //   theme: 'plain'
    // });

    return doc.save("invoice");
  }

  public checkPrestation() {
    let prestation = (<HTMLSelectElement>document.getElementById("prestation")).value;
    let message = (<HTMLSpanElement>document.getElementById("popup"));

    if (prestation === "none") {
      message.hidden = false
    } else {
      message.hidden = true
      this.downloadInvoice()
    }
  }

  public checkProducts() {
    let produit = (<HTMLSelectElement>document.getElementById("product")).value;
    let message2 = (<HTMLSpanElement>document.getElementById("popup2"));

    if (produit === "undefined") {
      message2.hidden = false
    } else {
      message2.hidden = true
      this.downloadInvoice()
    }
  }
}