# Ailot Mobile Dictionary
Ailot is a React Native based dictionary framework for the preservation of minority languages. This is part of the Phonemica dictionary project presented at the Language Documentation Tools Summit at the University of Melbourne on 1-3 June 2016.

The goal of the Ailot dictionary project is to provide a free and easy to use tool to allow linguists and community members to create mobile phone dictionaries for under-served languages. The project is being deleveloped in React Native to provide cross-platform compatibility.

Currently we are testing two verisons of the app, one for [Tai Ahom](https://en.wikipedia.org/wiki/Ahom_language) and one for [Tai Phake](https://en.wikipedia.org/wiki/Tai_Phake_language). Afterfurther testing of the app itself and the [Toolbox converter](https://github.com/phonemica/ailot_converter), we will start testing with other languages. Since each language variety has its own unique set of demands, it's worth testing over a wide range to work out what problems may come up.

## Data format

Both [Ichō](https://github.com/phonemica/icho) and [Ailot](https://github.com/phonemica/ailot) use a common JSON structure — also provided by [Metric](https://github.com/phonemica/metric), a Toolbox conversion utility — seen below. Additional languages need only need to be added to the appropriate nested objects to be called automatically where needed.

```json
[{
    "gloss": {
        "english": "mueang",
        "lao": "ເມືອງ",
        "mandarin": "勐",
        "shan": "မိူင်း",
    },
    "phonemic": {
        "english": "mɯaŋ",
        "lao": "mɯaŋ˦",
        "mandarin": "měng",
        "shan": "məŋ˦",
    },
    "definition": {
        "english": [
            "pre-modern semi-independent city-states or principalities in Indochina",
            "a town having a defensive wall and a ruler with at least the Thai noble rank of khun"
        ],
        "mandarin": [
            "早期泰国、寮国与缅甸撣邦与中國雲南西双版纳和印度阿薩姆的泰族自治城邦国家"
        ]
    },
    "example": {
        "english": ["", ""],
        "mandarin": [""],
    },
    "pos": ["noun"],
    "image": "mueang",
    "sound": "mueang"
}]
```

## Screenshots

![](http://phonemica.net/github/jingpo20170126.jpg)

## Implementations

The following are dictionary apps built on the Ailot project:

* [Jingpo Dictionary](https://github.com/phonemica/jingpo/), developed by Phonemica for the Singpho Language & Cultural Development Society.
