// utils/converter.ts
import yaml from 'js-yaml';

// 1. .properties को ऑब्जेक्ट में बदलना
export function parseProperties(text: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = text.split(/\r?\n/);
    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) return;
        const delimiterIdx = trimmed.search(/[=: ]/);
        if (delimiterIdx === -1) return;
        const key = trimmed.substring(0, delimiterIdx).trim();
        let value = trimmed.substring(delimiterIdx + 1).trim();

        if (!isNaN(value as any) && value !== '') {
            result[key] = Number(value);
        } else if (value.toLowerCase() === 'true') {
            result[key] = true;
        } else if (value.toLowerCase() === 'false') {
            result[key] = false;
        } else {
            result[key] = value;
        }
    });
    return result;
}

// 2. ऑब्जेक्ट को .properties टेक्स्ट में बदलना
export function convertToProperties(obj: Record<string, any>): string {
    let str = '';
    for (const [key, value] of Object.entries(obj)) {
        str += `${key}=${value}\n`;
    }
    return str.trim() || '# No elements found';
}

// 3. मुख्य कनवर्टर जो किसी भी फ़ॉर्मेट से किसी भी फ़ॉर्मेट में बदलेगा
export function masterConvert(inputText: string, source: string, target: string): string {
    if (!inputText.trim()) return '';

    try {
        let intermediateObj: Record<string, any> = {};

        // स्टेप A: इनपुट फ़ॉर्मेट को पहले JavaScript Object में बदलें
        if (source === '.properties') {
            intermediateObj = parseProperties(inputText);
        } else if (source === 'JSON') {
            intermediateObj = JSON.parse(inputText);
        } else if (source === 'YAML') {
            intermediateObj = yaml.load(inputText) as Record<string, any>;
        }

        // स्टेप B: उस Object को यूजर के चुने हुए टारगेट फ़ॉर्मेट में बदलें
        if (target === '.properties') {
            return convertToProperties(intermediateObj);
        } else if (target === 'JSON') {
            return JSON.stringify(intermediateObj, null, 4);
        } else if (target === 'YAML') {
            return yaml.dump(intermediateObj);
        }

        return '';
    } catch (err: any) {
        return `Error parsing or converting data: ${err.message || 'Invalid Syntax'}`;
    }
}
