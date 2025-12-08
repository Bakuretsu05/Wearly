"""
Machine Learning Module for Clothing Analysis

This module provides:
- Clothing region parsing (shirt, pants, shoes)
- Attribute classification (sleeve length, fabric, colors, etc.)
- Color extraction from regions
- Style evaluation with ChatGPT
"""

# Import main processing function
from output import process_image, generate_clothing_categories

__all__ = ['process_image', 'generate_clothing_categories']

