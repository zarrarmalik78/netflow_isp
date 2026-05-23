from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .complaint_analyzer import ComplaintAnalyzer

@login_required
def analyzer_view(request):
    if request.user.role != 'admin':
        from django.core.exceptions import PermissionDenied
        raise PermissionDenied

    context = {'active_menu': 'ai_analyzer'}
    if request.method == 'POST':
        text = request.POST.get('complaint_text', '')
        if text:
            analyzer = ComplaintAnalyzer()
            result = analyzer.analyze_complaint(text)
            
            # Map API result to UI format
            data = result['data']
            confidence_pct = int(float(data.get('confidence', 0)) * 100)
            
            # Map category to display
            cat_map = {
                'speed_issue': 'Speed / Performance',
                'router': 'Router Instability',
                'outage': 'Network Outage',
                'billing': 'Billing Inquiry',
                'installation': 'New Installation'
            }
            display_cat = cat_map.get(data.get('category', 'outage'), 'Unknown Issue')
            
            # Mock estimation
            est_res = "2-4 hours | Assign field technician" if data.get('priority') in ['urgent', 'medium'] else "Remote reset recommended"
            
            context['result'] = {
                'category': display_cat,
                'confidence': confidence_pct,
                'priority': data.get('priority', 'medium').title(),
                'suggested_action': data.get('suggested_action', 'Manual review required'),
                'estimated_resolution': est_res,
            }
            context['input_text'] = text
    
    return render(request, 'ai_engine/analyzer.html', context)
