"""
WarrantyVault REST API Server
Provides endpoints for OCR receipt extraction, statutory RMA claim letters, and vault telemetry.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from backend.agents.claim_drafter import StatutoryClaimDrafterAgent
from backend.engine.ocr_extractor import ReceiptOCRExtractor

app = FastAPI(
    title="WarrantyVault Statutory Defense API",
    version="1.0.0",
    description="Backend microservice for consumer electronics warranty tracking, OCR, and RMA claim synthesis."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

claim_agent = StatutoryClaimDrafterAgent()
ocr_engine = ReceiptOCRExtractor()

class ReceiptParseRequest(BaseModel):
    raw_ocr_text: str

class ClaimDraftRequest(BaseModel):
    device_name: str
    serial_number: str
    purchase_date: str
    retailer: str
    claimant_name: str
    defect_description: str
    jurisdiction: Optional[str] = "US_UCC"
    desired_remedy: Optional[str] = "Immediate replacement with an authentic factory-new unit"

@app.get("/api/health")
def health_check():
    return {
        "status": "OPERATIONAL",
        "service": "WarrantyVault Defense Engine",
        "version": "1.0.0"
    }

@app.post("/api/ocr/parse")
def parse_receipt(req: ReceiptParseRequest):
    try:
        result = ocr_engine.parse_receipt_text(req.raw_ocr_text)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/claims/draft")
def draft_statutory_claim(req: ClaimDraftRequest):
    try:
        letter_data = claim_agent.generate_demand_letter(
            device_name=req.device_name,
            serial_number=req.serial_number,
            purchase_date=req.purchase_date,
            retailer=req.retailer,
            claimant_name=req.claimant_name,
            defect_description=req.defect_description,
            jurisdiction=req.jurisdiction or "US_UCC",
            desired_remedy=req.desired_remedy or "Immediate replacement with an authentic factory-new unit"
        )
        return {"success": True, "claim": letter_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vault/devices")
def get_vault_inventory():
    return {
        "devices": [
            {
                "id": "dev_mbp16",
                "name": "MacBook Pro 16-inch (M3 Max)",
                "category": "Laptop",
                "serial": "C02G80XYZ940",
                "retailer": "Apple Fifth Avenue",
                "price": 3499.00,
                "purchase_date": "2024-03-15",
                "oem_months": 12,
                "statutory_months": 24,
                "status": "ACTIVE"
            },
            {
                "id": "dev_sony_xm5",
                "name": "Sony WH-1000XM5 Wireless ANC",
                "category": "Audio",
                "serial": "SN-9982410-XM5",
                "retailer": "Best Buy Manhattan",
                "price": 399.99,
                "purchase_date": "2024-06-20",
                "oem_months": 12,
                "statutory_months": 24,
                "status": "WARNING"
            },
            {
                "id": "dev_dell_6k",
                "name": "Dell UltraSharp U3224KB 6K Display",
                "category": "Display",
                "serial": "CN-0R894D-74445",
                "retailer": "B&H Photo Video",
                "price": 2899.00,
                "purchase_date": "2023-11-10",
                "oem_months": 36,
                "statutory_months": 36,
                "status": "ACTIVE"
            },
            {
                "id": "dev_rtx_4090",
                "name": "ASUS ROG Strix RTX 4090 OC",
                "category": "Graphics Card",
                "serial": "M9C0CX009842",
                "retailer": "Micro Center Brooklyn",
                "price": 1999.99,
                "purchase_date": "2023-08-01",
                "oem_months": 36,
                "statutory_months": 36,
                "status": "ACTIVE"
            }
        ]
    }
