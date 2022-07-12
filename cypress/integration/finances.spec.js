/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

context('Controle Financeiro', () => {

    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        });
        cy.get('header img').should("have.attr", "alt", "Logo Dev Finance")
        cy.get('#data-table tbody tr').should("have.length", 2)
    })

    it('Cadastrar entradas', () => {
        cy.get('#transaction a[class="button new"]').click()

        cy.get('#form h2').should("have.text", "Nova Transação")
        cy.get('.input-group input#description').type("Mesada")
        cy.get('.input-group input[name=amount]').type(100)
        cy.get('.input-group input[type=date]').type("2022-07-11")

        //cy.contains('button', "Salvar").click()
        cy.get('button').contains("Salvar").click()

        //cy.get('#incomeDisplay').contains(100)

        cy.get('#data-table tbody tr').should("have.length", 3)
        
    });

    it('Cadastrar saidas', () => {
        cy.get('#transaction a[class="button new"]').click()

        cy.get('#form h2').should("have.text", "Nova Transação")
        cy.get('.input-group input#description').type("Comida")
        cy.get('.input-group input[name=amount]').type(-35)
        cy.get('.input-group input[type=date]').type("2022-07-11")

        cy.contains('button', "Salvar").click()

        //cy.get('#expenseDisplay').contains(35)
        
        cy.get('#data-table tbody tr').should("have.length", 3)
    });

    it('Remover entradas e saidas', () => {
        //cy.get('#transaction a[class="button new"]').click()
        //cy.get('#form h2').should("have.text", "Nova Transação")
        //cy.get('.input-group input#description').type("Mesada")
        //cy.get('.input-group input[name=amount]').type(100)
        //cy.get('.input-group input[type=date]').type("2022-07-11")
        //cy.get('button').contains("Salvar").click()
        //cy.get('#incomeDisplay').contains(100)

        //cy.get('#transaction a[class="button new"]').click()
        //cy.get('#form h2').should("have.text", "Nova Transação")
        //cy.get('.input-group input#description').type("Comida")
        //cy.get('.input-group input[name=amount]').type(-35)
        //cy.get('.input-group input[type=date]').type("2022-07-11")
        //cy.contains('button', "Salvar").click()
        //cy.get('#expenseDisplay').contains(35)

        //cy.get('#totalDisplay').contains(65)
    
        cy.get('#data-table tbody tr').should("have.length", 2)

        //cy.contains('#data-table tbody tr', 'Mesada')
        //    .then((item) => {
        //        expect(item).to.contain('100')
        //        expect(item).to.contain('11/07/2022')
        //})

        //cy.contains('#data-table tbody tr', 'Comida')
        //    .then((item) => {
        //        expect(item).to.contain('35')
        //        expect(item).to.contain('11/07/2022')
        //})

        cy.contains('#data-table tbody tr', 'Mesada')
            .then((item) => {
                // item.find('td img').click()
                item.find('td img[alt="Remover transação"]').trigger('click')
            })
            .should('not.exist')

        cy.contains('#data-table tbody tr', 'Comida')
            .then((item) => {
                // item.find('td img').click()
                item.find('td img[alt="Remover transação"]').trigger('click')
            })
            .should('not.exist')

        // Outras opções de excluir
        //cy.get('td.description')
        //    .contains("Mesada")
        //    .parent()
        //    .find("img[onclick*=remove]")
        //    .click()

        //cy.get('td.description')
        //    .contains("Comida")
        //    .siblings()
        //    .children("img[onclick*=remove]")
        //    .click()

        cy.get('#data-table tbody tr').should("have.length", 0)
        cy.get('#totalDisplay').contains(0)
            
    });

    it('Validar saldo com diversas transações', () => {

        let incomes = 0
        let expenses = 0
        let total = 0

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                //cy.log(index)

                cy.get($el)
                    .find('td.income, td.expense')
                    .invoke("text")
                    .then(text => {
                        //cy.log(text)
                        //cy.log(format(text))
                        if (text.includes("-")){
                            expenses = expenses + format(text)
                        } else {
                            incomes = incomes + format(text)
                        }
                        cy.log("Entradas", incomes)
                        cy.log("Saídas", expenses)
                    })
            })
        
        cy.get('#totalDisplay').invoke("text").then(text => {
            let expectedTotal = incomes + expenses
            cy.log("Valor total: ", format(text))
            cy.log("Soma total: ", expectedTotal)

            total = total + format(text)

            expect(expectedTotal).to.eq(total)
        })
    });

});