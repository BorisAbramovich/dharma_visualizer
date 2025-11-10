"""
Test the actual UI flow: meditate_on_latest() -> apply_time_based_meditation()
This simulates what happens when the user clicks the "Meditate" button in the UI
"""

from bayesian_model import BayesianBeliefModel
import time


def test_ui_meditation_flow():
    """Test the full UI flow of clicking the meditate button"""
    print("\n=== Testing UI Meditation Flow ===")
    
    model = BayesianBeliefModel()
    
    # Set initial cultivation manually
    model.set_brahma_viharas_level(0.1)
    print(f"Initial cultivation (manual): {model.brahma_viharas_level * 100:.1f}%")
    
    # Add experiences that will create squeezing
    model.add_experience(5.0, sigma=0.5)
    model.add_experience(-5.0, sigma=0.5)
    print("Added 2 experiences (one squeezed)")
    
    # Get initial squeezing cost
    state = model.get_state()
    initial_cost = state['suffering_metrics']['total_squeezing_cost']
    print(f"Initial squeezing cost: {initial_cost:.2f}")
    
    # User clicks "Meditate" button with 100% intensity
    # This is what the frontend does
    model.meditate_on_latest(1.0)
    print("User clicked 'Meditate' button (100%)")
    
    # The meditation animates over 2 seconds
    # We need to call apply_time_based_meditation to process it
    print("Waiting for meditation to complete...")
    
    # Simulate the animation loop (normally called from get_state())
    for i in range(5):
        time.sleep(0.5)
        model.apply_time_based_meditation()
        current_cultivation = model.brahma_viharas_level
        print(f"  {i*0.5:.1f}s: Cultivation = {current_cultivation * 100:.1f}%")
    
    # Check final cultivation
    final_state = model.get_state()
    final_cultivation = final_state['brahma_viharas_level']
    final_cost = final_state['suffering_metrics']['total_squeezing_cost']
    
    print(f"\nFinal cultivation: {final_cultivation * 100:.1f}%")
    print(f"Final squeezing cost: {final_cost:.2f}")
    print(f"Squeezing reduced: {initial_cost - final_cost:.2f}")
    
    # Verify cultivation increased
    assert final_cultivation > 0.1, f"Cultivation should increase from 10%, got {final_cultivation * 100:.1f}%"
    
    print("✅ UI meditation flow test passed!")


def test_automatic_vs_manual():
    """Test that automatic meditation doesn't increase cultivation but manual does"""
    print("\n=== Testing Automatic vs Manual Meditation ===")
    
    model = BayesianBeliefModel()
    
    # Set cultivation to 50%
    model.set_brahma_viharas_level(0.5)
    print(f"Manual cultivation: {model.brahma_viharas_level * 100:.1f}%")
    
    # Add an experience (will auto-meditate due to 50% cultivation)
    model.add_experience(3.0, sigma=0.5)
    print("Added experience with 50% auto-meditation")
    
    # Wait for automatic meditation to process
    time.sleep(0.6)
    model.apply_time_based_meditation()
    
    cultivation_after_auto = model.brahma_viharas_level
    print(f"After automatic meditation: {cultivation_after_auto * 100:.1f}%")
    assert cultivation_after_auto == 0.5, "Automatic meditation shouldn't change cultivation"
    
    # Now add another experience and manually meditate
    model.add_experience(-5.0, sigma=0.5)
    print("\nAdded squeezed experience")
    
    # Manual meditation
    model.meditate_on_latest(1.0)
    print("User clicked 'Meditate' button")
    
    # Process manual meditation
    time.sleep(2.5)
    model.apply_time_based_meditation()
    
    final_cultivation = model.brahma_viharas_level
    print(f"After manual meditation: {final_cultivation * 100:.1f}%")
    
    assert final_cultivation > 0.5, f"Manual meditation should increase cultivation from 50%, got {final_cultivation * 100:.1f}%"
    
    print("✅ Automatic vs manual test passed!")


if __name__ == "__main__":
    print("=" * 60)
    print("TESTING UI FLOW FOR CULTIVATION")
    print("=" * 60)
    
    try:
        test_ui_meditation_flow()
        test_automatic_vs_manual()
        
        print("\n" + "=" * 60)
        print("✅ ALL UI FLOW TESTS PASSED!")
        print("=" * 60)
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        raise
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        raise
