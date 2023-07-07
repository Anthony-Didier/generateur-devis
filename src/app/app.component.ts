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

  products = [
    { "name": "Jus d'orange (1 l)", "comment": "", "price": 2.09, "quantity": 1, "tax": 10, "totalHT": 2.09 },
    { "name": "Cidre (75 cl)", "comment": "", "price": 2.50, "quantity": 1, "tax": 20, "totalHT": 2.50 },
  ];

  public static selectedProducts: any;
  public static selectedProductsName: any;
  public static selectedProductsComment: any;
  public static selectedProductsPrice: any;
  public static selectedProductsQuantity: any;
  public static selectedProductsTax: any;
  public static selectedProductsTotalHT: any;
  public static filteredProducts: any;

  public classReference = AppComponent;

  qte: any;

  commentaire: any;

  public static productsList: any[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      date: ['', Validators.required],
      number: ['', Validators.required],
      place: ['', Validators.required],
      time: ['', Validators.required],
      name: ['', Validators.required],
      service: ['', Validators.required],
      po: ['', Validators.required],
    })

    this.createForm.valueChanges.subscribe((v) => {
      this.isNextDisabled = !this.createForm.valid;
    });
  }

  public onProductsSelected() {
    // console.log(this.selectedProducts);
    (<HTMLInputElement>document.getElementById("quantity")).value = "1";
    AppComponent.filteredProducts = this.products.filter(t => t.tax == AppComponent.selectedProducts);
    AppComponent.selectedProductsName = AppComponent.selectedProducts.name;
    AppComponent.selectedProductsComment = AppComponent.selectedProducts.comment;
    AppComponent.selectedProductsPrice = AppComponent.selectedProducts.price.toFixed(2);
    AppComponent.selectedProductsQuantity = AppComponent.selectedProducts.quantity;
    AppComponent.selectedProductsTax = AppComponent.selectedProducts.tax;
    AppComponent.selectedProductsTotalHT = AppComponent.selectedProducts.totalHT.toFixed(2);
    (<HTMLTableCellElement>document.getElementById("totalHT")).innerHTML = AppComponent.selectedProducts.totalHT.toFixed(2) + " €";
    (<HTMLDivElement>document.getElementById("selection")).hidden = false;
    (<HTMLTableElement>document.getElementById("selectionTable")).hidden = false;
    (<HTMLTableElement>document.getElementById("totalTable")).hidden = false;

    AppComponent.productsList.push({ name: AppComponent.selectedProductsName, comment: "", price: AppComponent.selectedProductsPrice, quantity: 1, tax: AppComponent.selectedProductsTax, totalHT: 0 })

    // console.log(AppComponent.productsList)

    let table = (<HTMLTableElement>document.getElementById("selectionTable"));
    table.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    row.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    let cell1 = row.insertCell(0);
    cell1.innerHTML = AppComponent.selectedProductsName;
    cell1.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    let cell2 = row.insertCell(1);
    let element1 = document.createElement("textarea");
    element1.id = "comment";
    element1.style.cssText = "width: 500px;";
    cell2.appendChild(element1);
    cell2.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"
    element1.addEventListener("change", function onCommentChange() {
      // console.log(element1.value)
      AppComponent.productsList[(row.rowIndex) - 2].comment = element1.value
    })

    let cell3 = row.insertCell(2);
    cell3.innerHTML = AppComponent.selectedProductsPrice + " €";
    cell3.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    let cell4 = row.insertCell(3);
    let element2 = document.createElement("input");
    element2.type = "number";
    element2.setAttribute("ng-model", "qte");
    element2.addEventListener("change", function onQuantityChange() {
      // console.log(element2.value)
      // AppComponent.selectedProductsQuantity = element2.value;
      // console.log(AppComponent.productsList[(row.rowIndex) - 2].name);
      AppComponent.productsList[(row.rowIndex) - 2].quantity = element2.value
      AppComponent.productsList[(row.rowIndex) - 2].totalHT = (AppComponent.productsList[(row.rowIndex) - 2].price * parseInt(element2.value)).toFixed(2);
      cell6.innerHTML = AppComponent.productsList[(row.rowIndex) - 2].totalHT + " €"
      // console.log("Quantité : " + AppComponent.selectedProductsQuantity);
      console.log(AppComponent.productsList[(row.rowIndex) - 2]);
    })
    element2.addEventListener("keypress", (event) => {
      event.preventDefault();
    });
    element2.addEventListener('keydown', (e) => {
      if (e.keyCode === 8 || e.keyCode === 46) {
        e.preventDefault();
      }
      return false;
    })
    element2.style.cssText = "width: 70px;";
    element2.id = "quantity"
    element2.min = "1"
    element2.setAttribute("oninput", "'this.value = !!this.value && Math.abs(this.value) >= 1 ? Math.abs(this.value) : null'");
    element2.setAttribute("form-control-name", "quantity");
    element2.value = "1";
    cell4.appendChild(element2);
    cell4.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    let cell5 = row.insertCell(4);
    cell5.innerHTML = AppComponent.selectedProductsTax + " %";
    cell5.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    let cell6 = row.insertCell(5);
    cell6.innerHTML = AppComponent.selectedProducts.totalHT.toFixed(2) + " €"
    cell6.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    let cell7 = row.insertCell(6);
    cell7.innerHTML = "";
    cell7.style.cssText = "border-collapse: collapse; border: 1px solid black; padding: 8px; margin-top: 10px;"

    // AppComponent.selectedProductsComment = AppComponent.selectedProducts.comment;
  }

  // public addProducts() {
  //   // console.log(AppComponent.commentaires)
  //   this.productsList.forEach((elem, i) => {
  //     // elem.comment = AppComponent.commentaires[i]
  //     // elem.quantity = AppComponent.quantites[i]
  //     // elem.totalHT = AppComponent.totauxHT[i]
  //   })
  //   console.log(this.productsList)
  // }

  public downloadInvoice() {
    const date = new Date();

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
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

    let info: any[][] = [];
    let infoTotalHT = 0;
    let infoTotalTVA10 = 0;
    let infoTotalTVA20 = 0;
    let infoTotalTTC = 0;

    AppComponent.productsList.forEach((element, index, array) => {
      info.push([element.name, element.comment, element.price + " €", element.quantity, element.tax + " %", element.totalHT + " €"])
      infoTotalHT += parseFloat(element.totalHT);
      if (element.tax == 10) {
        infoTotalTVA10 += (element.totalHT * 0.1)
      } else if (element.tax == 20) {
        infoTotalTVA20 += (element.totalHT * 0.2)
      }
      infoTotalTTC = infoTotalHT + infoTotalTVA10 + infoTotalTVA20
    });

    autoTable(doc, {
      head: [['Désignation', 'Commentaires', 'P.U. HT', 'Qté', 'TVA', 'Total HT']],
      body: info,
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40'
      },
      columnStyles: {
        0: {
          fontSize: 10,
          valign: "middle"
        },
        1: {
          cellWidth: 80,
          fontSize: 8,
          fontStyle: "italic",
          valign: "middle"
        },
        2: {
          fontSize: 10,
          halign: "center",
          valign: "middle"
        },
        3: {
          fontSize: 10,
          halign: "center",
          valign: "middle"
        },
        4: {
          fontSize: 10,
          halign: "center",
          valign: "middle"
        },
        5: {
          fontSize: 10,
          halign: "center",
          valign: "middle"
        }
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Total HT:',
            styles: {
              halign: 'right',
              fontStyle: 'bold'
            }
          },
          {
            content: infoTotalHT.toFixed(2) + " €",
            styles: {
              halign: 'right'
            }
          },
        ],
        [
          {
            content: 'Total TVA 10 %:',
            styles: {
              halign: 'right',
              fontStyle: 'bold'
            }
          },
          {
            content: infoTotalTVA10.toFixed(2) + " €",
            styles: {
              halign: 'right'
            }
          },
        ],
        [
          {
            content: 'Total TVA 20 %:',
            styles: {
              halign: 'right',
              fontStyle: 'bold'
            }
          },
          {
            content: infoTotalTVA20.toFixed(2) + " €",
            styles: {
              halign: 'right'
            }
          },
        ],
        [
          {
            content: 'Total TTC:',
            styles: {
              halign: 'right',
              fontStyle: 'bold'
            }
          },
          {
            content: infoTotalTTC.toFixed(2) + " €",
            styles: {
              halign: 'right',
              fontStyle: 'bold'
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