"""
WV-STATUTORY-DRAFTER: Autonomous Legal Demand Letter Generation Agent
Cites UCC § 2-314, Magnuson-Moss Warranty Act (15 U.S.C. § 2301), and EU Directive (EU) 2019/771.
"""

from typing import Dict, Any, List
from datetime import datetime

class StatutoryClaimDrafterAgent:
    """Autonomous agent that constructs statutory warranty RMA demand letters."""

    STATUTORY_PREPARATION = {
        "US_UCC": {
            "statute_title": "Uniform Commercial Code § 2-314 (Implied Warranty of Merchantability) & Magnuson-Moss 15 U.S.C. § 2301",
            "legal_citations": [
                "U.C.C. § 2-314: Implied Warranty of Merchantability",
                "15 U.S.C. § 2308: Prohibition on Disclaimer of Implied Warranties",
                "U.C.C. § 2-714: Buyer's Remedies for Breach in Regard to Accepted Goods"
            ],
            "legal_teeth": (
                "Under Uniform Commercial Code § 2-314, consumer electronics are sold with an implied warranty "
                "of merchantability ensuring the hardware is fit for the ordinary purposes for which such goods are used. "
                "Furthermore, under the federal Magnuson-Moss Warranty Act (15 U.S.C. § 2308), sellers cannot disclaim "
                "or modify implied warranties when a written warranty is offered. Premature hardware failure within "
                "the statutory lifecycle constitutes a breach of implied merchantability irrespective of arbitrary "
                "1-year manufacturer limitations."
            ),
            "remedy_period_days": 14
        },
        "EU_DIRECTIVE": {
            "statute_title": "Directive (EU) 2019/771 on Certain Aspects Concerning Contracts for the Sale of Goods",
            "legal_citations": [
                "Directive (EU) 2019/771, Article 10: Conformity Guarantee Period",
                "Directive (EU) 2019/771, Article 11: Burden of Proof Presumption",
                "Directive (EU) 2019/771, Articles 13 & 14: Consumer Remedies (Repair, Replacement, Price Reduction)"
            ],
            "legal_teeth": (
                "Pursuant to Directive (EU) 2019/771 Article 10, the seller remains legally liable to the consumer "
                "for any lack of conformity which exists at the time when the goods were delivered and which becomes "
                "apparent within a minimum period of two (2) years from delivery. Any failure manifested within this "
                "statutory period is legally presumed to have existed at delivery without requiring consumer forensic proof."
            ),
            "remedy_period_days": 14
        },
        "UK_CRA": {
            "statute_title": "Consumer Rights Act 2015 (United Kingdom), Section 9 & 10",
            "legal_citations": [
                "Consumer Rights Act 2015 s.9: Goods to be of Satisfactory Quality",
                "Consumer Rights Act 2015 s.10: Goods to be Fit for a Particular Purpose",
                "Consumer Rights Act 2015 s.23 & s.24: Right to Repair, Replacement or Final Right to Reject"
            ],
            "legal_teeth": (
                "Under the Consumer Rights Act 2015 Sections 9 and 10, goods purchased must be of satisfactory quality, "
                "fit for purpose, and as described. High-tier consumer computing hardware possesses a statutory durability "
                "expectation of up to six (6) years under English Limitation Act 1980 / Scottish Prescription Act 1973."
            ),
            "remedy_period_days": 14
        }
    }

    def generate_demand_letter(
        self,
        device_name: str,
        serial_number: str,
        purchase_date: str,
        retailer: str,
        claimant_name: str,
        defect_description: str,
        jurisdiction: str = "US_UCC",
        desired_remedy: str = "Immediate replacement with an authentic factory-new unit or complete refund"
    ) -> Dict[str, Any]:
        """Synthesize formal statutory replacement demand letter."""
        jurisdiction_info = self.STATUTORY_PREPARATION.get(jurisdiction, self.STATUTORY_PREPARATION["US_UCC"])
        today = datetime.now().strftime("%B %d, %Y")

        letter_body = f"""FORMAL STATUTORY NOTICE OF WARRANTY NON-CONFORMITY & REPLACEMENT DEMAND
DATE: {today}
TO: Legal & Consumer Warranty Claims Department — {retailer}
RE: Formal Demand for Statutory Remedy | Hardware Serial: {serial_number}
CLAIMANT: {claimant_name}

1. PREAMBLE & DEVICE IDENTIFICATION
This formal communication constitutes statutory notice that the following hardware unit fails to conform to statutory standards of durability and merchantability:
- Device Model: {device_name}
- Hardware Serial Number: {serial_number}
- Purchase Date: {purchase_date}
- Merchant / Retailer of Record: {retailer}

2. DEFECT STATEMENT & NON-CONFORMITY
The hardware has suffered the following functional defect without user negligence, physical impact, or liquid contamination:
"{defect_description}"

3. STATUTORY LEGAL FOUNDATION
Governing Precedent: {jurisdiction_info['statute_title']}
Statutory Provisions Cited:
{chr(10).join(f"- {c}" for c in jurisdiction_info['legal_citations'])}

{jurisdiction_info['legal_teeth']}

4. DEMANDED STATUTORY REMEDY & DEADLINE
Demand is hereby made for: {desired_remedy}.
Please provide a prepaid insured RMA return dispatch container and authorization code within fourteen ({jurisdiction_info['remedy_period_days']}) business days of receipt of this notice.

Failure to resolve this claim within the statutory deadline will result in immediate escalation to the appropriate consumer protection bureau and statutory small claims arbitration.

Respectfully submitted,
{claimant_name}
Recorded via WarrantyVault Defense Engine (Audit Ref: WV-{serial_number[-6:] if len(serial_number)>=6 else '998231'})
"""
        return {
            "status": "DRAFTED",
            "jurisdiction": jurisdiction,
            "statute_title": jurisdiction_info['statute_title'],
            "statutory_citations": jurisdiction_info['legal_citations'],
            "letter_body": letter_body.strip(),
            "generated_at": today
        }
