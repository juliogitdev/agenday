import type { TableServicesData } from "../components/tables/ServicesTable"

 
const ServiceMock_2 = {
    name: "Barba Completa com Toalha Quente",
    duration: 45,
    price: 35.00,
    asPromotion: true,
    establishmentName: "Barbearia Dias",
    establishmentLocation: "Cabrobó-PE, Centro, 234",
    serviceId: "b789e123-4567-4d89-bcde-123456789abc"
}

const ServiceMock_3 = {
    name: "Coloração e Hidratação Capilar",
    duration: 120,
    price: 180.00,
    asPromotion: false,
    establishmentName: "Studio Beauty Hair",
    establishmentLocation: "Cabrobó-PE, Ipsep, 55",
    serviceId: "c456f789-1234-4b56-89ab-cdef12345678"
}

const ServiceMock_4 = {
    name: "Manicure e Pedicure Simples",
    duration: 75,
    price: 45.99,
    asPromotion: true,
    establishmentName: "Esmalteria Bella Donna",
    establishmentLocation: "Cabrobó-PE, Pedrinhas, 102",
    serviceId: "d123a456-7890-4c12-3456-def78901234a"
}

const ServiceMock_5 = {
    name: "Limpeza de Pele Profunda",
    duration: 90,
    price: 120.50,
    asPromotion: false,
    establishmentName: "Clínica Estética Revitalize",
    establishmentLocation: "Cabrobó-PE, Subestação, 410",
    serviceId: "e987b654-3210-4f98-ba98-fedcba987654"
}

const ServiceMock_6 = {
    name: "Tatuagem Small (Até 5cm)",
    duration: 90,
    price: 150.00,
    asPromotion: false,
    establishmentName: "Inked Soul Tattoo",
    establishmentLocation: "Cabrobó-PE, Centro, 88",
    serviceId: "f654c321-0123-4e65-bcba-abcdef012345"
}


export const ServicesDataMock:Array<TableServicesData> = [
    ServiceMock_2, ServiceMock_3,
    ServiceMock_4, ServiceMock_5,
    ServiceMock_6, ServiceMock_4,
    ServiceMock_4, ServiceMock_2,
    ServiceMock_4, ServiceMock_2,
    ServiceMock_4, ServiceMock_2,
    ServiceMock_4, ServiceMock_2,
    ServiceMock_4, ServiceMock_2,
    ServiceMock_4, ServiceMock_2,
]
