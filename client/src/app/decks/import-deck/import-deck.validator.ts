import { AbstractControl, ValidationErrors } from '@angular/forms';

export function importDeckValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Check if value is empty or not a string
    if (!value || typeof value !== 'string') {
        return { invalidJson: 'Input is not a valid JSON string' };
    }

    try {
        // Parse the JSON string
        const parsed = JSON.parse(value);

        // Check if it is an object with "name" and "cards" properties
        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            typeof parsed.name !== 'string' ||
            !Array.isArray(parsed.cards)
        ) {
            return { invalidJson: 'JSON does not match required structure' };
        }

        // Validate each object in the "cards" array
        for (const card of parsed.cards) {
            if (
                typeof card !== 'object' ||
                card === null ||
                typeof card.front !== 'string' ||
                typeof card.back !== 'string'
            ) {
                return { invalidJson: 'Cards array contains invalid objects' };
            }
        }

        // If all checks pass, return null (no errors)
        return null;
    } catch (error) {
        // If JSON.parse fails, return an error
        return { invalidJson: 'Invalid JSON format' };
    }
}
