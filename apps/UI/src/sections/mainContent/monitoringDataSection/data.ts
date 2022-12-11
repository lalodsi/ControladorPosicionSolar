import { TextType } from '../../../components/core/text'

type typesInterface = "Text" | "Section";

interface SectionChildren{
    title: string,
    value: string
}

interface DataInterface {
    type : typesInterface,
    textType: TextType | null,
    content: string | SectionChildren[]
}

const data: DataInterface[] = [
    {
        type: "Text",
        textType: TextType.header,
        content: "Información de monitoreo"
    },
    {
        type: "Text",
        textType: TextType.subheader,
        content: "Potencia Generada"
    },
    {
        type: "Text",
        textType: TextType.info,
        content: "Se muestra la potencia generada"
    },
    {
        type: "Section",
        textType: null,
        content: [
            {
                title: "Potencia en Watts",
                value: "######"
            }
        ]
    },
    {
        type: "Text",
        textType: TextType.info,
        content: "Estado de la conexión"
    },
    {
        type: "Text",
        textType: TextType.header,
        content: "Sensores"
    },
    {
        type: "Text",
        textType: TextType.info,
        content: "Valor de cada uno de los sensores del sistema"
    },
    {
        type: "Section",
        textType: null,
        content: [
            {
                title: "Sensor 1",
                value: "####"
            },
            {
                title: "Sensor 2",
                value: "####"
            },
            {
                title: "Sensor 3",
                value: "####"
            },
            {
                title: "Sensor 4",
                value: "####"
            },
            {
                title: "Sensor 5",
                value: "####"
            }
        ]
    },
    {
        type: "Text",
        textType: TextType.header,
        content: "Analisis Anova"
    },
    {
        type: "Text",
        textType: TextType.info,
        content: "Analisis realizado en tiempo real con la llegada de información por los sensores"
    },
    {
        type: "Text",
        textType: TextType.subheader,
        content: "Promedios de los sensores"
    },
    {
        type: "Section",
        textType: TextType.info,
        content: [
            {
                title: "Promedio Sensor 1",
                value: "####"
            },
            {
                title: "Promedio Sensor 2",
                value: "####"
            },
            {
                title: "Promedio Sensor 3",
                value: "####"
            },
            {
                title: "Promedio Sensor 4",
                value: "####"
            },
            {
                title: "Promedio Sensor 5",
                value: "####"
            }
        ]
    },
    {
        type: "Text",
        textType: TextType.subheader,
        content: "Varianzas de los sensores"
    },
    {
        type: "Section",
        textType: null,
        content: [
            {
                title: "Varianza Sensor 1",
                value: "####"
            },
            {
                title: "Varianza Sensor 2",
                value: "####"
            },
            {
                title: "Varianza Sensor 3",
                value: "####"
            },
            {
                title: "Varianza Sensor 4",
                value: "####"
            },
            {
                title: "Varianza Sensor 5",
                value: "####"
            }
        ]
    },
    {
        type: "Text",
        textType: TextType.subheader,
        content: "Información adicional del análisis Anova"
    },
    {
        type: "Section",
        textType: null,
        content: [
            {
                title: "Promedio Total:",
                value: "####"
            },
            {
                title: "S2PE:",
                value: "####"
            },
            {
                title: "S2factor:",
                value: "####"
            },
            {
                title: "F:",
                value: "####"
            },
        ]
    },
]

export default data;